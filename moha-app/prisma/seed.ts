import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing database
  console.log("🧹 Cleaning existing data...");
  await prisma.adminUser.deleteMany({});
  await prisma.news.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  await prisma.trailer.deleteMany({});
  await prisma.communityAnnouncement.deleteMany({});
  await prisma.subscriber.deleteMany({});
  await prisma.analyticsEvent.deleteMany({});
  await prisma.contactInquiry.deleteMany({});

  // 2. Create Admin User
  const adminPassword = "mohahorror2026";
  const passwordHash = hashPassword(adminPassword);
  const admin = await prisma.adminUser.create({
    data: {
      username: "admin",
      passwordHash: passwordHash,
      role: "admin",
    },
  });
  console.log(`👤 Created Admin User: ${admin.username} (password: ${adminPassword})`);

  // 3. Create News
  console.log("📰 Seeding News...");
  const newsItems = [
    {
      title: "MOHA: Sri Lankan Folklore Survival Horror Announced",
      slug: "moha-sri-lankan-folklore-survival-horror-announced",
      excerpt: "Black Mirage Studio reveals its flagship title, MOHA, bringing ancient Sri Lankan horror and demons to a global audience in Unreal Engine 5.",
      content: `### Sri Lankan Folklore Meets AAA Survival Horror

Black Mirage Studio is thrilled to officially announce our flagship title: **MOHA**. Developed by a passionate team of local designers and global visual artists, MOHA is a deeply immersive first-person survival horror experience rooted in the dark and rich mythology of Sri Lanka.

The game is built from the ground up in **Unreal Engine 5**, utilizing advanced technologies like Lumen and Nanite to recreate haunted, atmosphere-heavy Sri Lankan villages with terrifying fidelity.

### A Quest Born of Curiosity, Ended in Nightmare

The story follows a group of young skeptics and university researchers who travel to the remote, isolated village of **Meemure** to investigate reports of ancient exorcism rituals and supernatural disturbances. What they dismiss as primitive superstition quickly devolves into a desperate fight for survival when they accidentally awaken **Mahasona**, the legendary half-bear, half-lion demon, and his army of bloodthirsty spirits.

### Key Game Features:
* **First-Person Nightmare:** Blending classic resource management, complex puzzles, and tactical combat.
* **Sri Lankan Folklore:** Face five major demons of local legend: *Mahasona*, *Mohini*, *Kalukumaraya*, *Ririyaka*, and *Kinduri*.
* **Hyper-Realistic Environments:** Explore haunting recreations of real places, including the crumbling temple ruins of *Ritigala* and ancient ancestral manors (*Walawwas*).
* **Deep Narrative Tension:** Discover letters, rituals, and artifacts that reveal the dark secrets of the village and the tragic folklore of those who came before.

MOHA is slated for release on PC via Steam, with consoles to follow. Keep an eye on our development updates and get ready to face the darkness.`,
      imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop",
      category: "Announcement",
      author: "Black Mirage Studio",
    },
    {
      title: "Devlog #1: Recreating Ritigala Ruins and Meemure Forests in UE5",
      slug: "devlog-1-recreating-ritigala-ruins-and-meemure-forests-in-ue5",
      excerpt: "A deep dive into our environmental design process, photogrammetry of real locations, and how we craft a dense, choking psychological atmosphere.",
      content: `### Bringing Authenticity to Digital Horror

For **MOHA**, we knew that generic environments wouldn't suffice. The true power of Sri Lankan horror lies in its settings—dense, moisture-heavy jungles, ancient crumbling stone steps, and decaying ancestral manors that have witnessed centuries of family secrets and occult practices.

In our first devlog, we are taking you behind the scenes of our research trips to **Meemure** and **Ritigala**.

### 1. Photogrammetry and On-Site Visual Research
Our environmental art team spent three weeks in the dense forests of Meemure and the archaeological sanctuary of Ritigala. We captured over **15,000 high-resolution photos** and LIDAR scans of:
* Overgrown stone paths and ancient bathing pools.
* Weathered brickwork and moss-covered pillars from Buddhist monastery ruins dating back to the 1st century BC.
* Authentic 19th-century *Walawwas* (manor houses) with central courtyards (*Meda Midula*) and heavy wooden columns.

Using these scans, our asset team created custom Nanite meshes that capture the exact texture of decayed granite, damp wood, and tropical moss.

### 2. Crafting the Psychological Atmosphere
To make the player feel constantly watched, we have implemented several atmospheric systems:
* **Volumetric Fog & Moisture Shimmer:** A custom fog shader that gathers in low-lying areas and reacts dynamically to light sources, reflecting the damp, tropical heat.
* **Unreal Engine 5 Lumen Lighting:** Dynamically computed bounce light from the moon, torches, and the player's flickering flashlight, casting long, distorted shadows that play tricks on the eyes.
* **Interactive Foliage:** Every fern, vine, and blade of grass sways dynamically as the player—or something else—moves through them.

Stay tuned for our next devlog, where we will showcase our motion capture workflow for the terrifying demon animations!`,
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      category: "Devlog",
      author: "Art Team",
    },
    {
      title: "Unveiling the Mahasona: Behind the Design of Sri Lanka's Supreme Demon",
      slug: "unveiling-the-mahasona-behind-the-design-of-sri-lankas-supreme-demon",
      excerpt: "Learn about the legendary lore of Mahasona, his origins as a colossal giant warrior, and how we translated his myth into an unstoppable horror antagonist.",
      content: `### The Legend of the Great Cemetery Demon

In Sri Lankan folklore, **Mahasona** (pronounced *Maha-Sona*) is the king of grave-dwelling demons. He is feared above all others, a colossal figure standing over 12 feet tall, possessing the head of a fierce bear (or lion) and the body of a muscular giant, riding a giant black boar and carrying a blood-dripping club.

But who was Mahasona before he became a demon?

### The Tragic Origin: Jayasena the Giant
According to the ancient chronicle *Mahavamsa*, Mahasona was originally a human warrior named **Jayasena**, a giant of immense strength during the reign of King Dutugemunu (161–137 BC). After insulting a legendary royal commander named Gotaimbara, a catastrophic duel of strength took place. 

Gotaimbara, with a single acrobatic kick, severed Jayasena's head. Seeking to save his life, Jayasena's friends rushed to find a head to attach before his spirit left his body. In their panic, they could only find a bear. They attached the bear's head backward, and Jayasena revived—not as a man, but as a monstrous, half-dead abomination. Filled with shame and rage, he fled into the deep forests, transforming into the graveyard-dwelling demon Mahasona.

### Translating the Legend into Gameplay
In **MOHA**, Mahasona is not an enemy you can simply shoot and kill. He is an persistent, terrifying stalker entity.
* **Sound-Based Hunting:** Mahasona is blind but possesses hyper-acute hearing. Running, stepping on dried twigs, or breathing heavily in fear will draw him directly to your location.
* **Visual Aberrations:** As he approaches, the player's vision will distort. The screen will suffer chromatic aberration, a cold pulse will emanate from the controller/mouse, and distant, echoing boar-grunts will fill the audio field.
* **The Mark of the Paw:** Traditional folklore states that Mahasona kills his victims by slamming his giant paw onto their backs, leaving a blue/black bruise shaped like a hand. If he catches you, expect a brutal, cinematic end that pays homage to this chilling detail.

Will you survive his hunt? Or will you join the spirits that wander his graveyard?`,
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      category: "Lore",
      author: "Lore Consultant",
    }
  ];

  for (const item of newsItems) {
    const createdNews = await prisma.news.create({
      data: item,
    });
    console.log(`  - Created news: "${createdNews.title}"`);
  }

  // 4. Create Gallery Items
  console.log("🖼️ Seeding Gallery Items...");
  const galleryItems = [
    {
      title: "The Ancient Ruins of Ritigala",
      description: "A crumbling Buddhist monastery temple dating back to the 1st Century BC, now claimed by dense roots and ancient curses.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
      category: "temple",
    },
    {
      title: "Inside the Abandoned Walawwa",
      description: "The ancestral manor of the local village chieftain, abandoned in haste in 1973. Legends say the walls still whisper of the blood spill.",
      imageUrl: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?q=80&w=1200&auto=format&fit=crop",
      category: "walawwa",
    },
    {
      title: "Mahasona's Shadow",
      description: "A chilling silhouette of the graveyard king moving through the Meemure cemetery ruins under a blood-red moon.",
      imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop",
      category: "character",
    },
    {
      title: "The Call of Mohini",
      description: "An ethereal and terrifying demon that appears as a beautiful woman holding a child, lureing travelers into the dark forest.",
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
      category: "character",
    },
    {
      title: "Forest Canopy Fog Concept",
      description: "Initial environment concept art showcasing the choking volumetric fog of Meemure's dense rainforest canopy.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
      category: "concept_art",
    },
    {
      title: "Moonlit Paddy Fields",
      description: "A safe-looking path that holds immediate danger. Step lightly, or the Ririyaka (Blood Demon) will hear you.",
      imageUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=1200&auto=format&fit=crop",
      category: "screenshot",
    }
  ];

  for (const item of galleryItems) {
    const createdItem = await prisma.galleryItem.create({
      data: item,
    });
    console.log(`  - Created gallery item: "${createdItem.title}"`);
  }

  // 5. Create Trailers
  console.log("🎥 Seeding Trailers...");
  const trailers = [
    {
      title: "MOHA - Official Demo Announcement Trailer",
      videoId: "4t_3dhmuYHY", // YouTube Video ID
      description: "Watch the official trailer for MOHA's upcoming Steam demo, featuring gameplay clips, environmental showcases, and a first look at the horrors of Meemure.",
      category: "Trailer",
      isFeatured: true,
    },
    {
      title: "MOHA - Alpha Gameplay Mechanics Teaser",
      videoId: "4t_3dhmuYHY",
      description: "Explore the survival horror mechanics of MOHA, showing the flashlight battery system, physical item investigation, and puzzle-solving in the Ritigala temple ruins.",
      category: "Gameplay",
      isFeatured: false,
    },
    {
      title: "Unreal Engine 5 Graphics Tech Showcase",
      videoId: "4t_3dhmuYHY",
      description: "An in-depth look at how Black Mirage Studio utilizes UE5 features like Lumen global illumination, Nanite geometry, and MetaSound spatial audio to craft a legendary psychological atmosphere.",
      category: "Teaser",
      isFeatured: false,
    }
  ];

  for (const t of trailers) {
    await prisma.trailer.create({
      data: t,
    });
  }
  console.log(`  - Seeded ${trailers.length} trailers.`);

  // 6. Create Community Announcements
  console.log("📢 Seeding Community Announcements...");
  const announcements = [
    {
      title: "Join Our Official Discord and Chat with Devs!",
      content: "Become a part of the Black Mirage Studio community! Talk directly with the game directors, artists, and sound designers. Share your feedback, fan art, or theories about Sri Lankan folklore.",
      link: "https://discord.gg/blackmirage",
      linkText: "Join Discord Server",
      platform: "discord",
    },
    {
      title: "MOHA Steam Store Page is Now Live!",
      content: "We are incredibly excited to announce that MOHA is officially on Steam! Head over to the store page to wishlist the game, view high-res screenshots, and be the first to know when our playable demo drops.",
      link: "https://store.steampowered.com/app/moha",
      linkText: "Wishlist on Steam",
      platform: "steam",
    },
    {
      title: "Exclusive Lore Drops and Concept Art on Twitter/X",
      content: "Follow our social media channels for weekly breakdowns of ancient Sri Lankan demons, occult folklore rituals, and behind-the-scenes creature sculpts.",
      link: "https://twitter.com/blackmirage",
      linkText: "Follow @BlackMirage",
      platform: "twitter",
    }
  ];

  for (const a of announcements) {
    await prisma.communityAnnouncement.create({
      data: a,
    });
  }
  console.log(`  - Seeded ${announcements.length} community announcements.`);

  // 7. Create Subscribers (for report page and stats)
  console.log("📧 Seeding Newsletter Subscribers...");
  const subscribers = [
    { email: "survivalist_pro@gmail.com" },
    { email: "horrorfanatic99@yahoo.com" },
    { email: "gamin_srilankan@gmail.lk" },
    { email: "claudedev@mirage.studio" },
    { email: "steam_wishlister@outlook.com" },
    { email: "screamer_reacts@youtube.com" },
    { email: "dev_saman@colombo.university.lk" },
    { email: "p.perera@architects.lk" },
    { email: "silentscape@gmail.com" },
    { email: "game_director@blackmirage.studio" }
  ];

  for (const s of subscribers) {
    await prisma.subscriber.create({
      data: s,
    });
  }
  console.log(`  - Seeded ${subscribers.length} subscribers.`);

  // 8. Create Analytics Events (for report graphs & calculations)
  console.log("📈 Seeding Analytics Events (Wishlist/Steam Clicks)...");
  // Let's seed clicks spread over the last 7 days to simulate nice reports
  const today = new Date();
  const eventsData = [];

  const types = ["wishlist_click", "steam_click", "trailer_view"];
  const counts = [142, 98, 215]; // Mock quantities

  for (let i = 0; i < 7; i++) {
    const eventDate = new Date();
    eventDate.setDate(today.getDate() - i);

    // Randomize clicks per day
    const wishlistCount = Math.floor(15 + Math.random() * 25);
    const steamCount = Math.floor(10 + Math.random() * 15);
    const trailerCount = Math.floor(25 + Math.random() * 40);

    for (let j = 0; j < wishlistCount; j++) {
      eventsData.push({
        eventType: "wishlist_click",
        metadata: "Wishlisted MOHA on Steam from Landing Page",
        createdAt: new Date(eventDate.getTime() - Math.random() * 86400000),
      });
    }

    for (let j = 0; j < steamCount; j++) {
      eventsData.push({
        eventType: "steam_click",
        metadata: "Clicked Coming Soon on Steam",
        createdAt: new Date(eventDate.getTime() - Math.random() * 86400000),
      });
    }

    for (let j = 0; j < trailerCount; j++) {
      eventsData.push({
        eventType: "trailer_view",
        metadata: "Watched Reveal Trailer",
        createdAt: new Date(eventDate.getTime() - Math.random() * 86400000),
      });
    }
  }

  // Create transactions in batches for high-speed insertion
  await prisma.analyticsEvent.createMany({
    data: eventsData,
  });
  console.log(`  - Seeded ${eventsData.length} analytics events across 7 days.`);

  // 9. Create Contact Inquiries
  console.log("✉️ Seeding Contact Inquiries...");
  const inquiries = [
    {
      name: "Suresh Silva",
      email: "suresh.silva@outlook.com",
      subject: "Inquiry about Closed Alpha Testing",
      message: "Hello Black Mirage team! I am a massive horror fan based in Colombo. I saw your announcement on Facebook and wanted to know if there is an application process to participate in your closed alpha or playtesting sessions in Meemure. I would love to support a local AAA project!",
      isRead: false,
      createdAt: new Date(today.getTime() - 1 * 3600000 * 4), // 4 hours ago
    },
    {
      name: "Jessica Vance",
      email: "j.vance@ign.com",
      subject: "Press Key & Interview Request - MOHA",
      message: "Hi there, I am a senior editor at IGN. We are running an upcoming feature on promising indie horror titles for 2026/2027 and would love to feature MOHA. Are you open for a short written interview with your lead game director? Also, do you have a press kit available? Thanks!",
      isRead: true,
      createdAt: new Date(today.getTime() - 1 * 3600000 * 25), // 25 hours ago
    },
    {
      name: "Dr. K. Bandara",
      email: "k_bandara@peradeniya.ac.lk",
      subject: "Folklore Consultation & Historical Accuracy",
      message: "Dear Black Mirage Studio, I am a lecturer in Archaeology and Cultural Anthropology. I read your devlog about Mahasona and your trip to Ritigala. I am extremely pleased to see our cultural folklore represented so seriously in video games. I would love to offer a free advisory session regarding historical accuracy of the exorcism mantras (Thovil) and yantras you plan to include. Please let me know if you are interested.",
      isRead: false,
      createdAt: new Date(today.getTime() - 3 * 86400000), // 3 days ago
    }
  ];

  for (const inq of inquiries) {
    await prisma.contactInquiry.create({
      data: inq,
    });
  }
  console.log(`  - Seeded ${inquiries.length} contact inquiries.`);

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
