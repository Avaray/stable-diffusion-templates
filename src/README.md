# 🗃 Collection of Stable Diffusion Templates

This is curated collection of templates for [Vast.ai](https://cloud.vast.ai/create/?ref_id=62878) and [Runpod.io](https://runpod.io/console/deploy?ref=gzvzzzv9) services.  
Their main purpose is to simplify the process of getting started with Stable Diffusion.  
These templates gives ready to use [Automatic1111 WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) thanks to [AI-Dock](https://github.com/ai-dock/stable-diffusion-webui). Plus they have some nice Lora's and useful Extensions preinstalled.

### Start generating graphics in minutes with just few clicks 😎

# 🦓 SDXL

Templates with checkpoints based on [Stable Diffusion XL](https://en.wikipedia.org/wiki/Stable_Diffusion).

|      Rating      | Checkpoint<br>Name | Version | Vast.ai | Runpod.io |
| :--------------: | :----------------: | :-----: | :-----: | :-------: |
| {{sdxlStarters}} |                    |         |         |

# 🦄 PDXL

Templates with checkpoints based on Pony Diffusion XL.

|      Rating      | Checkpoint<br>Name | Version | Vast.ai | Runpod.io |
| :--------------: | :----------------: | :-----: | :-----: | :-------: |
| {{pdxlStarters}} |                    |         |         |

# 🙊 What is [Vast.ai](https://cloud.vast.ai/create/?ref_id=62878) and [Runpod.io](https://runpod.io/console/deploy?ref=gzvzzzv9) ?

These are services that gives you access to powerful [GPUs](https://en.wikipedia.org/wiki/Graphics_processing_unit) like [RTX4090](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/) at low cost.  
They let you run [Docker images](https://docs.docker.com/guides/docker-overview/#what-can-i-use-docker-for) on their servers.

If you can't afford to buy a powerful Graphics Card (that is mandatory in graphics generation), these services are for you. In my opinion, services like these are the best way to get started with Stable Diffusion when you have weak graphics card and you don't have money to buy a powerful one. Btw. You can read [my old article](https://dav.one/the-ways-and-costs-of-generating-graphics-using-stable-diffusion) about _"the ways and costs of generating graphics"_.

These two services offer a lot of different machines with different hardware. There are also community machines that are cheaper. Both services have machine browsers where you can find the best machine for your needs. Currently renting community machine with RTX4090 on [Vast.ai](https://cloud.vast.ai/create/?ref_id=62878) costs about $0.2 per hour. On [Runpod.io](https://runpod.io/console/deploy?ref=gzvzzzv9) it's a little bit more expensive.

When you are registered on these services and logged in, you can use the links above to rent a machine with selected template. **It's super easy.**

# 🙉 What is [AI-Dock](https://github.com/ai-dock/stable-diffusion-webui) and [Provisioning Script](https://github.com/ai-dock/base-image/wiki/4.0-Running-the-Image#provisioning-script) ?

[AI-Dock](https://github.com/ai-dock/stable-diffusion-webui) allows users to run _Stable Diffusion_ with latest version of [Automatic1111 WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) in a Docker container. In my opinion the biggest advantage of this solution is that it starts quickly and you are able to connect to machine before all the checkpoints are downloaded. Because of that you can know at the beginning if docker image will work on machine you rented. Without AI-Dock you might waste few minutes waiting for checkpoints to download and then you will find out that something is wrong and you need to rent another machine. Except that AI-Dock comes with [Provisioning Script](https://github.com/ai-dock/base-image/wiki/4.0-Running-the-Image#provisioning-script), which is a script that installs all the necessary dependencies and downloads the checkpoints before starting the WebUI. So you don't need to do things manually.

Except [Automatic1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui), AI-Dock supports also other popular WebUIs like [ComfyUI](https://github.com/comfyanonymous/ComfyUI), [InvokeAI](https://github.com/invoke-ai/InvokeAI) and [Foooocus](https://github.com/lllyasviel/Fooocus). But all templates in this repository are based on Auto1111 - because it's my favorite WebUI.

# 🙈 Provisioning scripts in my Templates

Provisioning scripts in this Collection are based on official [Provisioning Script](https://github.com/ai-dock/stable-diffusion-webui/blob/main/config/provisioning/default.sh).  
In process of creating my provisioning scripts I'm replacing some parts of original script with my own stuff.  
Currently it includes:

- Each script has just one specific checkpoint. Does not include stock checkpoints.
- Each script has some useful Lora's that will work with that checkpoint. Basically there are two lists of Lora's - one for checkpoints based on [SDXL](https://github.com/Avaray/stable-diffusion-templates?tab=readme-ov-file#-sdxl) and one for checkpoints based on [PDXL](https://github.com/Avaray/stable-diffusion-templates?tab=readme-ov-file#-pdxl).
- Each script has some useful Extensions. Basically the same for all scripts. Except `taggers`.

To see what is included in each script, you can check sripts in [scripts directory](https://github.com/Avaray/stable-diffusion-templates/tree/main/scripts).  
In near future I will also add some useful Embeddings (Textual Inversions).

# 📋 TODO's

- [ ] Feature to auto-remove scripts for checkpoints that were removed.
- [ ] Add links to scripts in README file.
- [ ] Add Embeddings to templates.
- [ ] Add lists of Embeddings to README file.
- [ ] Add automatic tests.
- [ ] Add links to Lora models on CivitAI.
- [ ] Create Lite versions (without Loras).
- [ ] Find a way to automate the creation and modification of templates so that Playwright isn't needed.

# ♻️ FAQ

`Q` Will you add more checkpoints?  
`A` Yes. Currently I need to create templates manually, because these services does not provide API for managing templates. Believe me, it's a pain.

`Q` Will you add checkpoint X?  
`A` Please [open an discussion](https://github.com/Avaray/stable-diffusion-templates/discussions/new?category=ideas). But keep in mind that model must be battle tested on [CivitAI](https://civitai.com/models).

`Q` Will you add more services?  
`A` Maybe. Currently I don't know any better or at least as good as current ones.

`Q` Will you include [ControlNet](https://github.com/lllyasviel/ControlNet) models?
`A` No. They suck in SDXL and PDXL. You need to find a good ones by yourself.
