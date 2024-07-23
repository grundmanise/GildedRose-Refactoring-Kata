import { GildedRose, Item } from "@/gilded-rose";
import { describe, expect, it } from "@jest/globals";

const updateQualityForItem = (name, sellIn, quality) => {
  const item = new Item(name, sellIn, quality);
  const gildedRose = new GildedRose([item]);
  gildedRose.updateQuality();
  return item;
};

describe("Gilded Rose", () => {
  it("should update inventory items every day", () => {
    const items = [
      new Item("+5 Dexterity Vest", 10, 20),
      new Item("Aged Brie", 2, 0),
      new Item("Elixir of the Mongoose", 5, 7),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Sulfuras, Hand of Ragnaros", -1, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 49),
      // new Item("Conjured Mana Cake", 3, 6) conjured item are not yet implemented
    ];
    const gildedRose = new GildedRose(items);
    const days = 30;
    const daySnapshots = Array.from({ length: days + 1 }, (_, day) => {
      const daySnapshot = {
        day,
        items: items.map(({ name, sellIn, quality }) => ({
          name,
          sellIn,
          quality,
        })),
      };
      gildedRose.updateQuality();
      return daySnapshot;
    });

    expect(daySnapshots).toMatchSnapshot();
  });

  it.each([
    {
      name: "Elixir of the Mongoose",
      sellIn: 0,
      quality: 10,
      expectedQuality: 8,
    },
    { name: "+5 Dexterity Vest", sellIn: 0, quality: 12, expectedQuality: 10 },
  ])(
    "$name should degrade in quality twice as fast after sell-by date",
    ({ name, sellIn, quality, expectedQuality }) => {
      const item = updateQualityForItem(name, sellIn, quality);
      expect(item.quality).toEqual(expectedQuality);
    }
  );

  it.each([
    {
      name: "Elixir of the Mongoose",
      sellIn: 5,
      quality: 0,
      expectedQuality: 0,
    },
    { name: "+5 Dexterity Vest", sellIn: 4, quality: 0, expectedQuality: 0 },
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: -1,
      quality: 0,
      expectedQuality: 0,
    },
  ])(
    "$name should never have negative quality",
    ({ name, sellIn, quality, expectedQuality }) => {
      const item = updateQualityForItem(name, sellIn, quality);
      expect(item.quality).toEqual(expectedQuality);
    }
  );

  it.each([
    { name: "Aged Brie", sellIn: 2, quality: 50, expectedQuality: 50 },
    {
      name: "Backstage passes to a TAFKAL80ETC concert",
      sellIn: 5,
      quality: 50,
      expectedQuality: 50,
    },
  ])(
    "$name should never increase in quality above 50",
    ({ name, sellIn, quality, expectedQuality }) => {
      const item = updateQualityForItem(name, sellIn, quality);
      expect(item.quality).toEqual(expectedQuality);
    }
  );

  describe("Aged Brie", () => {
    it("should increase in quality as it gets older", () => {
      const item = updateQualityForItem("Aged Brie", 2, 0);
      expect(item.quality).toEqual(1);
    });

    it("should increase in quality twice as fast after sell-by date", () => {
      const item = updateQualityForItem("Aged Brie", 0, 0);
      expect(item.quality).toEqual(2);
    });
  });

  describe("Sulfuras", () => {
    it("should not change in quality or sell-in days", () => {
      const item = updateQualityForItem("Sulfuras, Hand of Ragnaros", 0, 80);
      expect(item.quality).toEqual(80);
      expect(item.sellIn).toEqual(0);
    });
  });

  describe("Backstage passes", () => {
    it("should increase in quality as sell-in day approaches", () => {
      const item = updateQualityForItem(
        "Backstage passes to a TAFKAL80ETC concert",
        15,
        20
      );
      expect(item.quality).toEqual(21);
    });

    it("should increase in quality by 2 when the sell-in date is between 6-10 days", () => {
      [6, 7, 8, 9, 10].forEach((day) => {
        const item = updateQualityForItem(
          "Backstage passes to a TAFKAL80ETC concert",
          day,
          20
        );
        expect(item.quality).toEqual(22);
      });
    });

    it("should increase in quality by 3 when the sell-in date is between 1-5 days", () => {
      [1, 2, 3, 4, 5].forEach((day) => {
        const item = updateQualityForItem(
          "Backstage passes to a TAFKAL80ETC concert",
          day,
          20
        );
        expect(item.quality).toEqual(23);
      });
    });

    it("should drop in quality to 0 after the sell-in date", () => {
      const item = updateQualityForItem(
        "Backstage passes to a TAFKAL80ETC concert",
        0,
        20
      );
      expect(item.quality).toEqual(0);
    });
  });
});
