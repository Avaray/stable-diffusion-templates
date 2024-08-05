// List of checkpoints that are not good enough to be in this repo.

const blacklist = [
  {
    name: 'LUSTIFY! [SDXL NSFW & SFW checkpoint]',
    homepage: 'https://civitai.com/models/573152?modelVersionId=638929',
    version: '1',
    comment:
      'Unstable. Trained on bad quality data. Generates blurry and low-quality faces sometimes. Generates long bodies above 1024px',
  },
  {
    name: 'NatViS: Natural Vision',
    homepage: 'https://civitai.com/models/617652?modelVersionId=690475',
    version: '1',
    comment: 'Creates deformed bodies. Does not work well above 1024px.',
  },
];

export default blacklist;
