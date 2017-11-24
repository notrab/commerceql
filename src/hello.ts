export default async event => {
  await new Promise(r => setTimeout(r, 50));

  return {
    data: {
      message: `Hello ${event.data.name || 'World'}`,
    },
  };
};
