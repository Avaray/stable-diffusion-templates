#!/bin/bash
# This file will be sourced in init.sh
# Namespace functions with provisioning_

# https://raw.githubusercontent.com/ai-dock/stable-diffusion-webui/main/config/provisioning/default.sh

DISK_GB_REQUIRED=40

PIP_PACKAGES=()

EXTENSIONS=(
    'https://github.com/Mikubill/sd-webui-controlnet'
    'https://github.com/adieyal/sd-dynamic-prompts'
    'https://github.com/hako-mikan/sd-webui-regional-prompter'
    'https://github.com/Bing-su/adetailer'
    'https://github.com/picobyte/stable-diffusion-webui-wd14-tagger'
)

CHECKPOINT_MODELS=(
    # goddessOfRealism - 
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/CHECKPOINT/goddessOfRealism_gorPONYV10.safetensors'
)

LORA_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/1dkXLP.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/2.5DCartoonV2.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/3D_Animation_Diffusion_Pony_style.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/3Danimation_Disney_1.0.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/ALICESOFT_Dohna_Dohna_Game_Artstyle_PonyXL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/ALICESOFT_Dohna_Dohna_Game_Artstyle_Revised_PonyXL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Anime.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/BoldCAT_P3.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/BoldToon.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Concept Art Twilight Style SDXL_LoRA_Pony Diffusion V6 XL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/CyanVanilla12.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/EnvyPonyPrettyEyes01.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Expressive_H-000001.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/GalGadot_v1.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Line Art Style LoRA XL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Natalie-Portman_token_natport_woman_r64_model_EverClear_v1.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/OtherStyle_03-000003.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Piper_Perri.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Real_Dream_Pony_Experimental_3.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/RetroWave_PonyXL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Sasha_Gray.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Serpieri_for_Pony-000011.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Smooth Anime 2 Style SDXL_LoRA_Pony Diffusion V6 XL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Smooth Anime Style LoRA XL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Thigh Size Slider V2_alpha1.0_rank4_noxattn_last.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/Zankuro_Style_Pony.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/[GP] somethingweird [Pony XL].safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/cutesexyrobutts_style_xl_goofy.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/g0th1cPXL.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/goth-PN.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/hanging_breasts.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/n30nc4tXLP.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/princess_xl_v2.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/punk-PN.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/retro-neon-style-pony.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/sinfully_stylish_PONY_0.2.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/wreal_consolidated.safetensors'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/LORA/xl_more_art-full_v1.safetensors'
)

VAE_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/VAE/sdxl_vae.safetensors'
)

ESRGAN_MODELS=(
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/ESRGAN/2xHFA2kOmniSR.pth'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/ESRGAN/4x-UltraSharp.pth'
    'https://huggingface.co/datasets/AddictiveFuture/sdxl-pony-models-backup/resolve/main/ESRGAN/8x_NMKD-Superscale_150000_G.pth'
)

CONTROLNET_MODELS=()

EMBEDDINGS=()

function provisioning_start() {
    source /opt/ai-dock/etc/environment.sh
    source /opt/ai-dock/bin/venv-set.sh webui

    DISK_GB_AVAILABLE=$(($(df --output=avail -m "${WORKSPACE}" | tail -n1) / 1000))
    DISK_GB_USED=$(($(df --output=used -m "${WORKSPACE}" | tail -n1) / 1000))
    DISK_GB_ALLOCATED=$(($DISK_GB_AVAILABLE + $DISK_GB_USED))
    provisioning_print_header
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
    
    # Start and exit because webui will probably require a restart
    cd /opt/stable-diffusion-webui && \
    source "$WEBUI_VENV/bin/activate"
    LD_PRELOAD=libtcmalloc.so python launch.py \
        ${ARGS_COMBINED}
    deactivate
    provisioning_print_end
}

function provisioning_get_pip_packages() {
    if [[ -n $PIP_PACKAGES ]]; then
        "$WEBUI_VENV_PIP" install --no-cache-dir ${PIP_PACKAGES[@]}
    fi
}

function provisioning_get_extensions() {
    for repo in "${EXTENSIONS[@]}"; do
        dir="${repo##*/}"
        path="/opt/stable-diffusion-webui/extensions/${dir}"
        requirements="${path}/requirements.txt"
        if [[ -d $path ]]; then
            # Pull only if AUTO_UPDATE
            if [[ ${AUTO_UPDATE,,} == "true" ]]; then
                printf "Updating extension: %s...\n" "${repo}"
                ( cd "$path" && git pull )
            fi
            # Always pip install
            if [[ -e $requirements ]]; then
                "$WEBUI_VENV_PIP" install --no-cache-dir -r "$requirements"
            fi
        else
            printf "Downloading extension: %s...\n" "${repo}"
            git clone "${repo}" "${path}" --recursive
            if [[ -e $requirements ]]; then
                "$WEBUI_VENV_PIP" install --no-cache-dir -r "${requirements}"
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

# Download from $1 URL to $2 file path
function provisioning_download() {
    wget -qnc --content-disposition --show-progress -e dotbytes="${3:-4M}" -P "$2" "$1"
}

provisioning_start