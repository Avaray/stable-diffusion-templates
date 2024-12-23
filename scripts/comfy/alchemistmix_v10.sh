#!/bin/bash

APT_PACKAGES=()

PIP_PACKAGES=()

NODES=(
    "https://github.com/ltdrdata/ComfyUI-Manager"
    "https://github.com/cubiq/ComfyUI_essentials"
)

CHECKPOINT_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/CHECKPOINT/alchemistmix_v10.safetensors'
)

UNET_MODELS=()

LORA_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/MS_Milf_Style_V2_Pony.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/MS_Milf_Style_V3_Pony.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Thigh_Size_Slider_V2_alpha1.0_rank4_noxattn_last.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/EnvyPonyPrettyEyes01.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/GLSHS_Style_V2_4.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/GLSHS_Style_V3_N.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/retro-neon-style-pony.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Retro_60s_Decarlo_V1_PDXL.safetensors'
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
    source /opt/ai-dock/bin/venv-set.sh comfyui

    provisioning_print_header
    provisioning_get_apt_packages
    provisioning_get_nodes
    provisioning_get_pip_packages
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/embeddings/negative" \
        "${EMBEDDINGS_NEGATIVE[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/embeddings/positive" \
        "${EMBEDDINGS_POSITIVE[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/ckpt" \
        "${CHECKPOINT_MODELS[@]}"
    provisioning_get_models \
        "${WORKSPACE}/storage/stable_diffusion/models/unet" \
        "${UNET_MODELS[@]}"
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
    provisioning_print_end
}

function pip_install() {
    if [[ -z $MAMBA_BASE ]]; then
            "$COMFYUI_VENV_PIP" install --no-cache-dir "$@"
        else
            micromamba run -n comfyui pip install --no-cache-dir "$@"
        fi
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

function provisioning_get_nodes() {
    for repo in "${NODES[@]}"; do
        dir="${repo##*/}"
        path="/opt/ComfyUI/custom_nodes/${dir}"
        requirements="${path}/requirements.txt"
        if [[ -d $path ]]; then
            if [[ ${AUTO_UPDATE,,} != "false" ]]; then
                printf "Updating node: %s...\n" "${repo}"
                ( cd "$path" && git pull )
                if [[ -e $requirements ]]; then
                   pip_install -r "$requirements"
                fi
            fi
        else
            printf "Downloading node: %s...\n" "${repo}"
            git clone "${repo}" "${path}" --recursive
            if [[ -e $requirements ]]; then
                pip_install -r "${requirements}"
            fi
        fi
    done
}

function provisioning_get_default_workflow() {
    if [[ -n $DEFAULT_WORKFLOW ]]; then
        workflow_json=$(curl -s "$DEFAULT_WORKFLOW")
        if [[ -n $workflow_json ]]; then
            echo "export const defaultGraph = $workflow_json;" > /opt/ComfyUI/web/scripts/defaultGraph.js
        fi
    fi
}

function provisioning_get_models() {
    if [[ -z $2 ]]; then return 1; fi
    
    dir="$1"
    mkdir -p "$dir"
    shift
    arr=("$@")
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

function provisioning_has_valid_hf_token() {
    [[ -n "$HF_TOKEN" ]] || return 1
    url="https://huggingface.co/api/whoami-v2"

    response=$(curl -o /dev/null -s -w "%{http_code}" -X GET "$url" \
        -H "Authorization: Bearer $HF_TOKEN" \
        -H "Content-Type: application/json")

    if [ "$response" -eq 200 ]; then
        return 0
    else
        return 1
    fi
}

function provisioning_has_valid_civitai_token() {
    [[ -n "$CIVITAI_TOKEN" ]] || return 1
    url="https://civitai.com/api/v1/models?hidden=1&limit=1"

    response=$(curl -o /dev/null -s -w "%{http_code}" -X GET "$url" \
        -H "Authorization: Bearer $CIVITAI_TOKEN" \
        -H "Content-Type: application/json")

    if [ "$response" -eq 200 ]; then
        return 0
    else
        return 1
    fi
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
