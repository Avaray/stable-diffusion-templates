#!/bin/bash

DISK_GB_REQUIRED=40

PIP_PACKAGES=()

CHECKPOINT_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/CHECKPOINT/realvisxlV40_v40Bakedvae.safetensors'
)

LORA_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/looking_at_viewer.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/weight_slider-sdxl.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/MS_Milf_Style_V2_Pony.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/age_slider-sdxl.safetensors'
)

function provisioning_start() {
    source /opt/ai-dock/etc/environment.sh
    source /opt/ai-dock/bin/venv-set.sh fooocus

    DISK_GB_AVAILABLE=$(($(df --output=avail -m "${WORKSPACE}" | tail -n1) / 1000))
    DISK_GB_USED=$(($(df --output=used -m "${WORKSPACE}" | tail -n1) / 1000))
    DISK_GB_ALLOCATED=$(($DISK_GB_AVAILABLE + $DISK_GB_USED))

    provisioning_print_header
    provisioning_get_pip_packages
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/ckpt" \
        "${CHECKPOINT_MODELS[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/lora" \
        "${LORA_MODELS[@]}"
    
    provisioning_print_end
}

function provisioning_get_pip_packages() {
    if [[ -n $PIP_PACKAGES ]]; then
        "$FOOOCUS_VENV_PIP" install --no-cache-dir ${PIP_PACKAGES[@]}
    fi
}

function provisioning_get_models() {
    if [[ -z $2 ]]; then return 1; fi
    dir="$1"
    mkdir -p "$dir"
    shift
    if [[ $DISK_GB_ALLOCATED -ge $DISK_GB_REQUIRED ]]; then
        arr=("$@")
    else
        printf "WARNING: Low disk space allocation - Only the first model will be downloaded!\n"
        arr=("$1")
    fi
    
    printf "Downloading %s model(s) to %s...\n" "${#arr[@]}" "$dir"
    for url in "${arr[@]}"; do
        printf "Downloading: %s\n" "${url}"
        provisioning_download "${url}" "${dir}"
        printf "\n"
    done
}

function provisioning_print_header() {
    printf "\n##############################################\n#                                            #\n#          Provisioning container            #\n#                                            #\n#         This will take some time           #\n#                                            #\n# Your container will be ready on completion #\n#                                            #\n##############################################\n\n"
    if [[ $DISK_GB_ALLOCATED -lt $DISK_GB_REQUIRED ]]; then
        printf "WARNING: Your allocated disk size (%sGB) is below the recommended %sGB - Some models will not be downloaded\n" "$DISK_GB_ALLOCATED" "$DISK_GB_REQUIRED"
    fi
}

function provisioning_print_end() {
    printf "\nProvisioning complete:  Fooocus will start now\n\n"
}

function provisioning_download() {
    if [[ -n $HF_TOKEN && $1 =~ ^https://([a-zA-Z0-9_-]+\.)?huggingface\.co(/|$|\?) ]]; then
        auth_token="$HF_TOKEN"
    elif 
        [[ -n $CIVITAI_TOKEN && $1 =~ ^https://([a-zA-Z0-9_-]+\.)?civitai\.com(/|$|\?) ]]; then
        auth_token="$CIVITAI_TOKEN"
    fi
    if [[ -n $auth_token ]];then
        wget --header="Authorization: Bearer $auth_token" -qnc --content-disposition --show-progress -e dotbytes="${3:-4M}" -P "$2" "$1"
    else
        wget -qnc --content-disposition --show-progress -e dotbytes="${3:-4M}" -P "$2" "$1"
    fi
}

provisioning_start