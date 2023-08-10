let storage = {
  posts: [
    {
      id: 10001,
      createdBy: "nikola@tankovic.me",
      postedAt: "1576599080230",
      source: "https://picsum.photos/id/669/500/500",
      title: "pula more",
    },
    {
      id: 10002,
      createdBy: "marko@markovic.me",
      postedAt: "1577349684270",
      source: "https://picsum.photos/id/234/500/500",
      title: "zagreb kopno",
    },
    {
      id: 10003,
      createdBy: "iva@ivkovic.me",
      postedAt: "1577349684270",
      source: "https://picsum.photos/id/12/500/500",
      title: "rijeka luka",
    },
  ],
  venues: [
    {
      name: "Tvornica Kulture",
      capacity: 2200,
      address: {
        streetAddress: "Šubićeva ulica 2",
        city: "Zagreb",
        postalCode: 10000,
      },
    },
    {
      name: "Boogaloo",
      capacity: 1200,
      address: {
        streetAddress: "Ulica grada Vukovara 68",
        city: "Zagreb",
        postalCode: 10000,
      },
    },
    {
      name: "Klub Crkva",
      capacity: 600,
      address: {
        streetAddress: "Ružićeva 22",
        city: "Rijeka",
        postalCode: 51000,
      },
    },
  ],
  artists: [
    {
      address: "0x732f28c7915589F769434CE6a18F680AE113612D",
      name: "The Prodigy",
    },
    {
      address: "0x4805015544C948D007CE269C09efb04377Faf92F",
      name: "Bullet For My Valentine",
    },
    {
      address: "0x149A8a0492a7DF89c064c78CdF301806CDA2687E",
      name: "Harry Styles",
    },
    {
      address: "0xb2591fD0cEF325fa4DdEDc0A905A8B7977e40FD8",
      name: "Imagine Dragons",
    },
  ],
};
export default storage;
