import { type Mosque, type InsertMosque, type Donation, type InsertDonation, type MosqueWithDonations } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllMosques(): Promise<MosqueWithDonations[]>;
  getMosqueById(id: string): Promise<MosqueWithDonations | undefined>;
  searchMosques(query: string, city?: string, size?: string): Promise<MosqueWithDonations[]>;
  getDonationsByMosqueId(mosqueId: string): Promise<Donation[]>;
  createMosque(mosque: InsertMosque): Promise<Mosque>;
  createDonation(donation: InsertDonation): Promise<Donation>;
}

export class MemStorage implements IStorage {
  private mosques: Map<string, Mosque>;
  private donations: Map<string, Donation>;

  constructor() {
    this.mosques = new Map();
    this.donations = new Map();
    this.seedData();
  }

  async getAllMosques(): Promise<MosqueWithDonations[]> {
    const mosquesArray = Array.from(this.mosques.values());
    return Promise.all(mosquesArray.map(async (mosque) => {
      const donations = await this.getDonationsByMosqueId(mosque.id);
      return {
        ...mosque,
        donations,
        donationsCount: donations.length
      };
    }));
  }

  async getMosqueById(id: string): Promise<MosqueWithDonations | undefined> {
    const mosque = this.mosques.get(id);
    if (!mosque) return undefined;

    const donations = await this.getDonationsByMosqueId(id);
    return {
      ...mosque,
      donations,
      donationsCount: donations.length
    };
  }

  async searchMosques(query: string, city?: string, size?: string): Promise<MosqueWithDonations[]> {
    let mosquesArray = Array.from(this.mosques.values());

    if (query) {
      mosquesArray = mosquesArray.filter(mosque => 
        mosque.name.includes(query) || mosque.description.includes(query)
      );
    }

    if (city && city !== "جميع المدن") {
      mosquesArray = mosquesArray.filter(mosque => mosque.city === city);
    }

    if (size && size !== "جميع الأحجام") {
      mosquesArray = mosquesArray.filter(mosque => mosque.size === size);
    }

    return Promise.all(mosquesArray.map(async (mosque) => {
      const donations = await this.getDonationsByMosqueId(mosque.id);
      return {
        ...mosque,
        donations,
        donationsCount: donations.length
      };
    }));
  }

  async getDonationsByMosqueId(mosqueId: string): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      donation => donation.mosqueId === mosqueId
    );
  }

  async createMosque(insertMosque: InsertMosque): Promise<Mosque> {
    const id = randomUUID();
    const mosque: Mosque = { ...insertMosque, id };
    this.mosques.set(id, mosque);
    return mosque;
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = { ...insertDonation, id, currentAmount: 0 };
    this.donations.set(id, donation);
    return donation;
  }

  private seedData() {
    // Syrian cities and their mosques
    const cities = [
      { name: "دمشق", lat: 33.5138, lng: 36.2765 },
      { name: "حلب", lat: 36.2021, lng: 37.1343 },
      { name: "حمص", lat: 34.7394, lng: 36.7076 },
      { name: "اللاذقية", lat: 35.5211, lng: 35.7834 },
      { name: "طرطوس", lat: 34.8833, lng: 35.8833 }
    ];

    const mosqueNames = [
      "مسجد الأمين", "المسجد الكبير", "مسجد الفاروق", "مسجد النور", "مسجد السلام",
      "مسجد التوحيد", "مسجد الرحمن", "مسجد الهدى", "مسجد الإيمان", "مسجد البركة",
      "مسجد المصطفى", "مسجد الأنصار", "مسجد الصحابة", "مسجد التقوى", "مسجد الشهداء"
    ];

    const areas = ["وسط البلد", "الحي القديم", "الحي الجديد", "المنطقة الشمالية", "المنطقة الجنوبية"];
    const sizes = ["صغير", "متوسط", "كبير"];
    const images = [
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
      "https://images.unsplash.com/photo-1549813069-f95e44d7f498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"
    ];

    cities.forEach((city, cityIndex) => {
      for (let i = 0; i < 10; i++) {
        const mosqueId = randomUUID();
        const nameIndex = (cityIndex * 10 + i) % mosqueNames.length;
        const mosque: Mosque = {
          id: mosqueId,
          name: `${mosqueNames[nameIndex]} - ${city.name}`,
          city: city.name,
          area: areas[i % areas.length],
          address: `${areas[i % areas.length]}، ${city.name}، سوريا`,
          latitude: city.lat + (Math.random() - 0.5) * 0.1,
          longitude: city.lng + (Math.random() - 0.5) * 0.1,
          size: sizes[i % sizes.length] as "صغير" | "متوسط" | "كبير",
          description: `مسجد مميز في ${city.name} يقدم خدمات دينية واجتماعية للمجتمع المحلي. يتميز بتصميمه المعماري الإسلامي الأصيل ويحتوي على مرافق حديثة لخدمة المصلين.`,
          mainImage: images[i % images.length],
          coverImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
          gallery: [
            "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
            "https://images.unsplash.com/photo-1549813069-f95e44d7f498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
            "https://pixabay.com/get/g51b4ea801ee83163c9ea00269a521aa8f5fa27fcbec4afdaa9c3fd999c32db759a38854f19cde7a72e153a5f973bb9cd236416103a1a60dbd688e8d0995ff364_1280.jpg"
          ],
          capacity: 150 + (i * 50),
          establishedYear: 1980 + i,
          phone: `011-${2200000 + cityIndex * 100000 + i}`,
          email: `info@mosque${cityIndex}${i}.sy`
        };

        this.mosques.set(mosqueId, mosque);

        // Add donations for each mosque
        const donationTitles = ["صيانة أنابيب المياه", "تجديد السجاد", "مكتبة القرآن الكريم", "إضاءة المسجد", "تكييف الهواء"];
        const priorities = ["عاجل", "مستمر", "جديد"] as const;
        const donationImages = [
          [
            "https://images.unsplash.com/photo-1580983561371-7f4b242d8ec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
            "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
          ],
          [
            "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
            "https://images.unsplash.com/photo-1549813069-f95e44d7f498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
          ],
          [
            "https://images.unsplash.com/photo-1564769625905-50e93615e769?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
          ],
          [],
          [
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
          ]
        ];
        
        for (let j = 0; j < Math.min(3, donationTitles.length); j++) {
          const donationId = randomUUID();
          const targetAmount = 10000 + (j * 5000);
          const currentAmount = Math.floor(targetAmount * (0.2 + Math.random() * 0.6));
          
          const donation: Donation = {
            id: donationId,
            mosqueId: mosqueId,
            title: donationTitles[j],
            description: `مشروع ${donationTitles[j]} يهدف إلى تحسين الخدمات المقدمة للمصلين وتوفير بيئة مريحة للعبادة.`,
            targetAmount,
            currentAmount,
            priority: priorities[j % priorities.length],
            isActive: true,
            images: donationImages[j] || []
          };

          this.donations.set(donationId, donation);
        }
      }
    });
  }
}

export const storage = new MemStorage();
