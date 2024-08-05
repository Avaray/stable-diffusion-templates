#!/bin/bash

DISK_GB_REQUIRED=40

APT_PACKAGES=(
    #"package-1"
    #"package-2"
)

PIP_PACKAGES=(
    #"package-1"
    #"package-2"
)

EXTENSIONS=(
    'https://github.com/Mikubill/sd-webui-controlnet'
    'https://github.com/adieyal/sd-dynamic-prompts'
    'https://github.com/hako-mikan/sd-webui-regional-prompter'
    'https://github.com/Bing-su/adetailer'
    'https://github.com/pharmapsychotic/clip-interrogator'
)

CHECKPOINT_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/CHECKPOINT/copaxTimelessxlSDXL1_v12.safetensors'
)

LORA_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/Desolation.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/DreamARTSDXL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/RMSDXL_Darkness_Cinema.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/RMSDXL_Photo.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/SDXLFaeTastic2400.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/SDXL_black_and_color_Sa_May.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/SDXL_vanta_black_contrast_V3.0.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/age_slider-sdxl.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/looking_at_viewer.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/retro-neon-xl-style.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/weight_slider-sdxl.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/LORA/zavy-rmlght-sdxl.safetensors'
)

VAE_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/VAE/sdxl_vae.safetensors'
)

ESRGAN_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/ESRGAN/2xHFA2kOmniSR.pth'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/ESRGAN/4x-UltraSharp.pth'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-1-0-models-backup/resolve/main/ESRGAN/8x_NMKD-Superscale_150000_G.pth'
)

CONTROLNET_MODELS=()

EMBEDDINGS=()

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
    ARGS_COMBINED="${PLATFORM_ARGS} $(cat /etc/a1111_webui_flags.conf) ${PROVISIONING_ARGS}"

    cd /opt/stable-diffusion-webui
    if [[ -z $MAMBA_BASE ]]; then
        source "$WEBUI_VENV/bin/activate"
        LD_PRELOAD=libtcmalloc.so python launch.py \
            ${ARGS_COMBINED}
        deactivate
    else 
        micromamba run -n webui -e LD_PRELOAD=libtcmalloc.so python launch.py \
            ${ARGS_COMBINED}
    fi
    provisioning_print_end
}

function pip_install() {
    if [[ -z $MAMBA_BASE ]]; then
            "$WEBUI_VENV_PIP" install --no-cache-dir "$@"
        else
            micromamba run -n webui pip install --no-cache-dir "$@"
        fi
}

function provisioning_get_apt_packages() {
    if [[ -n $APT_PACKAGES ]]; then
            $APT_INSTALL ${APT_PACKAGES[@]}
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
        path="/opt/stable-diffusion-webui/extensions/${dir}"
        requirements="${path}/requirements.txt"
        if [[ -d $path ]]; then

            if [[ ${AUTO_UPDATE,,} == "true" ]]; then
                printf "Updating extension: %s...\n" "${repo}"
                ( cd "$path" && git pull )
            fi

            if [[ -e $requirements ]]; then
                pip_install -r "$requirements"
            fi
        else
            printf "Downloading extension: %s...\n" "${repo}"
            git clone "${repo}" "${path}" --recursive
            if [[ -e $requirements ]]; then
                pip_install -r "${requirements}"
            fi
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