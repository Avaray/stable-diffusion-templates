# 🗃 Collection of Stable Diffusion Templates

This is curated collection of templates for [Vast.ai](https://cloud.vast.ai/create/?ref_id=62878). These templates gives you access to best
Stable Diffusion UIs and Checkpoints. You can start generating graphics in minutes with just few clicks 😎

# 🦓 SDXL

Templates with checkpoints based on [Stable Diffusion XL](https://en.wikipedia.org/wiki/Stable_Diffusion).

| Checkpoint<br>Name | Checkpoint<br>Version |     |     |     |     |
| :----------------: | :-------------------: | :-: | :-: | :-: | :-: |
|  {{sdxlStarters}}  |                       |     |     |     |     |

# 🦄 PDXL

Templates with checkpoints based on Pony Diffusion XL.

| Checkpoint<br>Name | Checkpoint<br>Version |     |     |     |     |
| :----------------: | :-------------------: | :-: | :-: | :-: | :-: |
|  {{pdxlStarters}}  |                       |     |     |     |     |

# 🙊 What is [Vast.ai](https://cloud.vast.ai/create/?ref_id=62878) ?

[Vast.ai](https://cloud.vast.ai/create/?ref_id=62878) gives you access to powerful
[GPUs](https://en.wikipedia.org/wiki/Graphics_processing_unit) like
[RTX4090](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/) at low cost.

This service offers a lot of different machines with different hardware. There is machine browser where you can find the best machine for
your needs. You just need to select [Template](https://cloud.vast.ai/templates/), select [machine](https://cloud.vast.ai/create/) and you
are ready to go.

If you can't afford to buy a powerful Graphics Card (that is mandatory in graphics generation), this service is for you. In my opinion,
services like these are the best way to get started with Stable Diffusion when you have weak graphics card and you don't have money to buy a
powerful one.

You can also read [my old article](https://dav.one/the-ways-and-costs-of-generating-graphics-using-stable-diffusion) about _"the ways and
costs of generating graphics"_.

# 🙉 What is [AI-Dock](https://github.com/ai-dock) and [Provisioning Script](https://github.com/ai-dock/base-image/wiki/4.0-Running-the-Image#provisioning-script) ?

[AI-Dock](https://github.com/ai-dock) provides
[Docker images](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/) with ready to use UIs for Stable
Diffusion. This makes it super easy to get started. The biggest advantage of these images is that you can use
[Provisioning Scripts](https://github.com/ai-dock/base-image/wiki/4.0-Running-the-Image#provisioning-script) to install all the necessary
dependencies and download models before starting the UI.

# 🙈 Provisioning scripts in this collection

Provisioning Scripts in this Collection are based on official provisioning scripts. In process of modifying provisioning scripts I'm
replacing all models, adding function to download Embeddings and removing unnecessary comments.

- Each script has just one specific checkpoint.
- Each script has just one [ControlNet](https://wiki.civitai.com/wiki/ControlNet) model -
  [Xinsir's Union](https://huggingface.co/xinsir/controlnet-union-sdxl-1.0).
- Each script has some useful [Lora's](https://wiki.civitai.com/wiki/Low-Rank_Adaptation) and
  [Embeddings](https://wiki.civitai.com/wiki/Embedding) that will work with that checkpoint.
- UI's based on [AUTO1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui), like
  [ForgeUI](https://github.com/lllyasviel/stable-diffusion-webui-forge), might have some useful Extensions like
  [ADetailer](https://github.com/Bing-su/adetailer).

To see what is included in each script, you can check sripts in
[scripts directory](https://github.com/Avaray/stable-diffusion-templates/tree/main/scripts).

# ♻️ FAQ

`Q` Will you add model X?\
`A` Probably not. I'm only adding the ones I think are good. If you believe a checkpoint should be included, please
[start a discussion](https://github.com/Avaray/stable-diffusion-templates/discussions/new?category=ideas). Just remember that the model
needs to be battle-tested on CivitAI or another platform, and it shouldn't already be on the
[blacklist]((https://github.com/Avaray/stable-diffusion-templates/blob/main/blacklist.ts)).
