let data = {
  ethEvents: [
    {
      name: "The Prodigy u Areni",
      start: 1695063600,
      end: 1695070800,
      ticketTypes: ["Parter", "Tribine", "VIP"],
      ticketSupplies: [4000, 19000, 1000],
      ticketPrices: [
        32257752344332150n,
        51612403750931436n,
        96773257032996450n,
      ],
    },
  ],

  dbEvents: [
    {
      ethEventAddress: "",
      name: "The Prodigy u Areni",
      // eth adresa koja ja izvršila transakciju za kreaciju eventa
      organizerAddress: "0x5D9b9cC9Ba98881F5DEfAE78263283E79FFdC449",
      startTime: 1695063600,
      endTime: 1695070800,
      venue: {
        _id: "64df53cc98f0c938f3d80edc",
        name: "Arena Zagreb",
        city: "Zagreb",
      },
      lineup: [
        {
          name: "The Prodigy",
          address: "0x732f28c7915589F769434CE6a18F680AE113612D",
        },
      ],
      tickets: [
        {
          type: "Parter",
          supply: 4000,
          weiPrice: "32257752344332150",
          eurPrice: 50,
        },
        {
          type: "Tribine",
          supply: 19000,
          weiPrice: "51612403750931436",
          eurPrice: 80,
        },
        {
          type: "VIP",
          supply: 1000,
          weiPrice: "96773257032996450",
          eurPrice: 150,
        },
      ],
    },
  ],
};

export default data;
