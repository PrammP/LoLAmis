export class Champion {
  constructor(
    nom,
    vie,
    armure,
    mana,
    resistanceMagique,
    degatsAttaque,
    porteeAttaque,
    vitesseMouvement,
    vitesseAttaque
  ) {
    this.nom = nom;
    this.vie = vie;
    this.armure = armure;
    this.mana = mana;
    this.resistanceMagique = resistanceMagique;
    this.degatsAttaque = degatsAttaque;
    this.porteeAttaque = porteeAttaque;
    this.vitesseMouvement = vitesseMouvement;
    this.vitesseAttaque = vitesseAttaque;
  }
}

export class Ability {
  constructor(nom, description, imageUrl) {
    this.nom = nom;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}

export class Passive {
  constructor(nom, description, imageUrl) {
    this.nom = nom;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}
