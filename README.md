# Završni rad - Razvoj pametnih ugovora i poslužiteljskog sloja Web3 aplikacije za upravljanje ulaznicama

Završni rad se sastoji od backend dijela koji se nalazi u ovom repozitoriju i frontend dijela, koji se može pregledati [ovdje](https://github.com/sblekic/zavrsni-frontend).

## Postavljanje projekta na lokalnom račualu

### Potreban softver

- [NodeJs](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) ili koristiti cloud verziju

### Podešavanje varijabli okruženja

U ".env.development.example" potrebno je promijeniti tekst koji se nalazi u vitičastim zagradama te preimenovati datoteku ".env.development".

### Instalacija npm paketa

```
npm install
```

### Pokretanje lokalnog blockchaina

```
npm run ganache
```

### Deploy pametnih ugovora

**Uvjet:** kopija [frontenda](https://github.com/sblekic/zavrsni-frontend) ovog projekta je preuzeta na računalu.

Između ostalog, pokretanjem ove skripte se ABI pametnih ugovora sprema na frontendu.

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
