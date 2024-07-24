export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  private static isItemExpired(item: Item) {
    return item.sellIn <= 0;
  }

  public items: Array<Item>;

  public constructor(items: Array<Item>) {
    this.items = items;
  }

  public updateQuality() {
    this.items.forEach((item) => {
      if (item.name === "Sulfuras, Hand of Ragnaros") {
        // noop
        return;
      }
      this.updateItemQuality(item);
      this.decreaseItemSellIn(item);
    });

    return this.items;
  }

  private decreaseItemSellIn(item: Item) {
    item.sellIn -= 1;
  }

  private updateItemQuality(item: Item) {
    if (item.name === "Aged Brie") {
      this.updateAgedBrieQuality(item);
    } else if (item.name === "Backstage passes to a TAFKAL80ETC concert") {
      this.updateBackstagePassesQuality(item);
    } else {
      this.updateStandardItemQuality(item);
    }
  }

  private updateItemQualityBy(item: Item, qualityChange: number) {
    item.quality = Math.max(Math.min(item.quality + qualityChange, 50), 0);
  }

  private updateAgedBrieQuality(item: Item) {
    const qualityChange = GildedRose.isItemExpired(item) ? +2 : +1;
    this.updateItemQualityBy(item, qualityChange);
  }

  private updateBackstagePassesQuality(item: Item) {
    const qualityChange = (() => {
      if (GildedRose.isItemExpired(item)) {
        return -item.quality; // drop quality to 0
      }
      if (item.sellIn <= 5) {
        return +3;
      }
      if (item.sellIn <= 10) {
        return +2;
      }
      return +1;
    })();
    this.updateItemQualityBy(item, qualityChange);
  }

  private updateStandardItemQuality(item: Item) {
    const qualityChange = GildedRose.isItemExpired(item) ? -2 : -1;
    this.updateItemQualityBy(item, qualityChange);
  }
}
