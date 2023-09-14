# Završni rad - Razvoj pametnih ugovora i poslužiteljskog sloja Web3 aplikacije za upravljanje ulaznicama

Završni rad se sastoji od backend dijela koji se nalazi u ovom repozitoriju i frontend dijela, koji se može pregledati [ovdje](https://github.com/sblekic/zavrsni-frontend).

## Potreban sofver za lokalno izvođenje aplikacije

- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) ili koristiti cloud verziju

## Postavljanje projekta na lokalnom račualu

### Instalacija npm paketa

```
npm install
```

### Pokretanje lokalnog blockchaina

```
npm run ganache
```

### Deploy pametnih ugovora

```
npx hardhat run scripts/deploy.js
```

### Punjenje baze podataka

```
npm run populateDb
```

### Pokretanje poslužitelja

```
npm run dev
```
