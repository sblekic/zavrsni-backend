let data = {
  ethEvents: [
    {
      name: "Nipplepeople",
      start: 1696014000,
      end: 1696021200,
      ticketTypes: ["Stajanje"],
      ticketSupplies: [600],
      ticketPrices: [15000000000000n],
    },
    {
      name: "Rage Against The Machine",
      start: 1698519600,
      end: 1698526800,
      ticketTypes: ["Stajanje", "Front of Stage", "VIP"],
      ticketSupplies: [15000, 8000, 2000],
      ticketPrices: [15000000000000n, 17000000000000n, 19000000000000n],
    },
    {
      name: "Eros Ramazzotti",
      start: 1698606000,
      end: 1698613200,
      ticketTypes: ["Trava", "Tribine", "Parter", "VIP zona"],
      ticketSupplies: [10000, 10000, 4000, 1000],
      ticketPrices: [
        13000000000000n,
        15000000000000n,
        17000000000000n,
        19000000000000n,
      ],
    },
    {
      name: "Imagine Dragons",
      start: 1722967200,
      end: 1722895200,
      ticketTypes: ["Trava", "Tribine", "Parter", "VIP zona"],
      ticketSupplies: [10000, 10000, 4000, 1000],
      ticketPrices: [
        13000000000000n,
        15000000000000n,
        17000000000000n,
        19000000000000n,
      ],
    },
    {
      name: "Bullet For My Valentine + Jinjer",
      start: 1708718400,
      end: 1708642800,
      ticketTypes: ["Stajanje"],
      ticketSupplies: [2200],
      ticketPrices: [15000000000000n],
    },
  ],

  dbEvents: [
    {
      ethEventAddress: "",
      name: "Nipplepeople",
      // eth adresa koja ja izvršila transakciju za kreaciju eventa
      organizerAddress: "0x5D9b9cC9Ba98881F5DEfAE78263283E79FFdC449",
      startTime: 1696014000,
      endTime: 1696021200,
      venue: {
        _id: "64e612df2b974c6ee776327a",
        name: "Pogon Kulture",
        city: "Rijeka",
      },
      lineup: [
        {
          name: "Nipplepeople",
          address: "0x732f28c7915589f769434ce6a18f680ae113612d",
        },
      ],
      tickets: [
        {
          type: "Stajanje",
          supply: 600,
          weiPrice: "15000000000000",
          eurPrice: 10,
        },
      ],
    },
    {
      ethEventAddress: "",
      name: "Rage Against The Machine",
      // eth adresa koja ja izvršila transakciju za kreaciju eventa
      organizerAddress: "0x5D9b9cC9Ba98881F5DEfAE78263283E79FFdC449",
      startTime: 1698519600,
      endTime: 1698526800,
      venue: {
        _id: "64e612df2b974c6ee776327c",
        name: "Arena Zagreb",
        city: "Zagreb",
      },
      lineup: [
        {
          name: "Rage Against The Machine",
          address: "0x4805015544c948d007ce269c09efb04377faf92f",
        },
      ],
      tickets: [
        {
          type: "Stajanje",
          supply: 15000,
          weiPrice: "15000000000000",
          eurPrice: 90,
        },
        {
          type: "Front of Stage",
          supply: 8000,
          weiPrice: "17000000000000",
          eurPrice: 130,
        },
        {
          type: "VIP",
          supply: 2000,
          weiPrice: "19000000000000",
          eurPrice: 150,
        },
      ],
    },
    {
      ethEventAddress: "",
      name: "Eros Ramazzotti",
      // eth adresa koja ja izvršila transakciju za kreaciju eventa
      organizerAddress: "0x5D9b9cC9Ba98881F5DEfAE78263283E79FFdC449",
      startTime: 1698606000,
      endTime: 1698613200,
      venue: {
        _id: "64e612df2b974c6ee776327d",
        name: "Arena Pula",
        city: "Pula",
      },
      lineup: [
        {
          name: "Eros Ramazzotti",
          address: "0x149a8a0492a7df89c064c78cdf301806cda2687e",
        },
      ],
      tickets: [
        {
          type: "Trava",
          supply: 10000,
          weiPrice: "13000000000000",
          eurPrice: 50,
        },
        {
          type: "Tribine",
          supply: 10000,
          weiPrice: "15000000000000",
          eurPrice: 70,
        },
        {
          type: "Parter",
          supply: 4000,
          weiPrice: "17000000000000",
          eurPrice: 100,
        },
        {
          type: "VIP zona",
          supply: 1000,
          weiPrice: "19000000000000",
          eurPrice: 150,
        },
      ],
    },
    {
      ethEventAddress: "",
      name: "Imagine Dragons",
      // eth adresa koja ja izvršila transakciju za kreaciju eventa
      organizerAddress: "0x5D9b9cC9Ba98881F5DEfAE78263283E79FFdC449",
      startTime: 1722967200,
      endTime: 1722895200,
      venue: {
        _id: "64e612df2b974c6ee776327d",
        name: "Arena Pula",
        city: "Pula",
      },
      lineup: [
        {
          name: "Imagine Dragons",
          address: "0xb2591fd0cef325fa4ddedc0a905a8b7977e40fd8",
        },
        {
          name: "APB",
          address: "0x2f47f8ede9accc1b3464c26d15f4c9953e84fe22",
        },
      ],
      tickets: [
        {
          type: "Trava",
          supply: 10000,
          weiPrice: "13000000000000",
          eurPrice: 50,
        },
        {
          type: "Tribine",
          supply: 10000,
          weiPrice: "15000000000000",
          eurPrice: 70,
        },
        {
          type: "Parter",
          supply: 4000,
          weiPrice: "17000000000000",
          eurPrice: 100,
        },
        {
          type: "VIP zona",
          supply: 1000,
          weiPrice: "19000000000000",
          eurPrice: 150,
        },
      ],
    },
    {
      ethEventAddress: "",
      name: "Bullet For My Valentine + Jinjer",
      // eth adresa koja ja izvršila transakciju za kreaciju eventa
      organizerAddress: "0x5D9b9cC9Ba98881F5DEfAE78263283E79FFdC449",
      startTime: 1708718400,
      endTime: 1708642800,
      venue: {
        _id: "64e612df2b974c6ee7763279",
        name: "Tvornica Kulture",
        city: "Zagreb",
      },
      lineup: [
        {
          name: "Bullet For My Valentine",
          address: "0xae52e68a9583823add0a064bb12a05fee1be742c",
        },
        {
          name: "Jinjer",
          address: "0x6ffebdcdd84246231d2a83e819b8fb54791064e7",
        },
      ],
      tickets: [
        {
          type: "Stajanje",
          supply: 2200,
          weiPrice: "15000000000000",
          eurPrice: 50,
        },
      ],
    },
  ],
};
export default data;
