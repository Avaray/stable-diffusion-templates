#!/bin/bash

DISK_GB_REQUIRED=40

APT_PACKAGES=()

PIP_PACKAGES=(
    "onnxruntime-gpu"
)

EXTENSIONS=(
    'https://github.com/adieyal/sd-dynamic-prompts'
    'https://github.com/Bing-su/adetailer'
    'https://github.com/Avaray/lora-keywords-finder'
    'https://github.com/picobyte/stable-diffusion-webui-wd14-tagger'
)

CHECKPOINT_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/CHECKPOINT/ponyDiffusionV6XL_v6StartWithThisOne.safetensors'
)

LORA_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/MS_Milf_Style_V2_Pony.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/MS_Milf_Style_V3_Pony.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Thigh_Size_Slider_V2_alpha1.0_rank4_noxattn_last.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/EnvyPonyPrettyEyes01.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/GLSHS_Style_V2_4.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/GLSHS_Style_V3_N.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/retro-neon-style-pony.safetensors'
)

VAE_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/VAE/sdxl_vae.safetensors'
)

ESRGAN_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/ESRGAN/4x-UltraSharp.pth'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/ESRGAN/2xHFA2kOmniSR.pth'
)

CONTROLNET_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/CONTROLNET/xinsir_union.safetensors'
)

EMBEDDINGS_POSITIVE=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/EMBEDDINGS/pos/zPDXL3.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/EMBEDDINGS/pos/zPDXLpg.pt'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/EMBEDDINGS/pos/zPDXLxxx.pt'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/EMBEDDINGS/pos/GlamorShots_PDXL.safetensors'
)

EMBEDDINGS_NEGATIVE=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/EMBEDDINGS/neg/EZNegPONYXL-neg.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/EMBEDDINGS/neg/VDiffPDXL_Neg-neg.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/EMBEDDINGS/neg/zPDXLpg-neg.pt'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/EMBEDDINGS/neg/zPDXLxxx-neg.pt'
)

function provisioning_start() {

    if [[ ! -d /opt/environments/python ]]; then 
        export MAMBA_BASE=true
    fi
    source /opt/ai-dock/etc/environment.sh
    source /opt/ai-dock/bin/venv-set.sh webui

    DISK_GB_AVAILABLE=$(($(df --output=avail -m "${WORKSPACE}" | tail -n1) / 1000))
    DISK_GB_USED=$(($(df --output=used -m "${WORKSPACE}" | tail -n1) / 1000))
    DISK_GB_ALLOCATED=$(($DISK_GB_AVAILABLE + $DISK_GB_USED))
    provisioning_print_header
    provisioning_get_apt_packages
    provisioning_get_pip_packages
    provisioning_get_extensions
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/embeddings/negative" \
        "${EMBEDDINGS_NEGATIVE[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/embeddings/positive" \
        "${EMBEDDINGS_POSITIVE[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/ckpt" \
        "${CHECKPOINT_MODELS[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/lora" \
        "${LORA_MODELS[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/controlnet" \
        "${CONTROLNET_MODELS[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/vae" \
        "${VAE_MODELS[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/esrgan" \
        "${ESRGAN_MODELS[@]}"
     
    PLATFORM_ARGS=""
    if [[ $XPU_TARGET = "CPU" ]]; then
        PLATFORM_ARGS="--use-cpu all --skip-torch-cuda-test --no-half"
    fi
    PROVISIONING_ARGS="--skip-python-version-check --no-download-sd-model --do-not-download-clip --port 11404 --exit"
    ARGS_COMBINED="${PLATFORM_ARGS} $(cat /etc/forge_args.conf) ${PROVISIONING_ARGS}"

    cd /opt/stable-diffusion-webui-forge
        source "$FORGE_VENV/bin/activate"
        LD_PRELOAD=libtcmalloc.so python launch.py \
            ${ARGS_COMBINED}
        deactivate

    provisioning_print_end
}

function pip_install() {
    "$FORGE_VENV_PIP" install --no-cache-dir "$@"
}

function provisioning_get_apt_packages() {
    if [[ -n $APT_PACKAGES ]]; then
            sudo $APT_INSTALL ${APT_PACKAGES[@]}
    fi
}

function provisioning_get_pip_packages() {
    if [[ -n $PIP_PACKAGES ]]; then
            pip_install ${PIP_PACKAGES[@]}
    fi
}

function provisioning_get_extensions() {
    for repo in "${EXTENSIONS[@]}"; do
        dir="${repo##*/}"
        path="/opt/stable-diffusion-webui-forge/extensions/${dir}"
        if [[ -d $path ]]; then

            if [[ ${AUTO_UPDATE,,} == "true" ]]; then
                printf "Updating extension: %s...\n" "${repo}"
                ( cd "$path" && git pull )
            fi
        else
            printf "Downloading extension: %s...\n" "${repo}"
            git clone "${repo}" "${path}" --recursive
        fi
    done
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
    printf "\nProvisioning complete:  Web UI will start now\n\n"
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