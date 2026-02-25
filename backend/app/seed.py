"""Seed script to populate the database with realistic mock data."""
import asyncio
import random
from datetime import date, timedelta
from decimal import Decimal

from app.database import async_session_factory, engine
from app.models import (
    ApplicationStatus,
    Base,
    BrandProfile,
    Campaign,
    CampaignApplication,
    CampaignStatus,
    InfluencerProfile,
    Platform,
    Role,
    User,
)
from app.services.auth_service import hash_password
from app.services.fraud_service import calculate_authenticity_score

CATEGORIES = ["fashion", "beauty", "fitness", "food", "travel", "tech", "gaming", "lifestyle", "music", "sports"]
LOCATIONS = [
    "Los Angeles, US", "New York, US", "London, UK", "Mumbai, IN", "Paris, FR",
    "Tokyo, JP", "Sydney, AU", "Toronto, CA", "Berlin, DE", "Sao Paulo, BR",
    "Dubai, AE", "Singapore, SG", "Seoul, KR", "Miami, US", "Chicago, US",
]
AGE_RANGES = ["13-17", "18-24", "25-34", "35-44", "45-54"]
COUNTRIES = ["US", "UK", "IN", "BR", "DE", "FR", "JP", "AU", "CA", "KR"]

INFLUENCER_DATA = [
    {"name": "Sophia Style", "categories": ["fashion", "lifestyle"], "platform": "instagram"},
    {"name": "FitWithMike", "categories": ["fitness", "lifestyle"], "platform": "youtube"},
    {"name": "TechTara", "categories": ["tech", "gaming"], "platform": "youtube"},
    {"name": "ChefMarco", "categories": ["food", "lifestyle"], "platform": "instagram"},
    {"name": "WanderlustAnya", "categories": ["travel", "lifestyle"], "platform": "instagram"},
    {"name": "GlowByJess", "categories": ["beauty", "fashion"], "platform": "tiktok"},
    {"name": "GameOnAlex", "categories": ["gaming", "tech"], "platform": "youtube"},
    {"name": "YogaWithPriya", "categories": ["fitness", "lifestyle"], "platform": "instagram"},
    {"name": "StreetEatsDan", "categories": ["food", "travel"], "platform": "tiktok"},
    {"name": "MakeupByLuna", "categories": ["beauty", "lifestyle"], "platform": "instagram"},
    {"name": "RyanRunsFar", "categories": ["fitness", "sports"], "platform": "youtube"},
    {"name": "PixelPete", "categories": ["gaming", "tech"], "platform": "tiktok"},
    {"name": "NomadNadia", "categories": ["travel", "lifestyle"], "platform": "instagram"},
    {"name": "SkinCareSam", "categories": ["beauty", "lifestyle"], "platform": "tiktok"},
    {"name": "BeatsByJay", "categories": ["music", "lifestyle"], "platform": "youtube"},
    {"name": "FashionFiona", "categories": ["fashion", "beauty"], "platform": "instagram"},
    {"name": "IronManIvan", "categories": ["fitness", "sports"], "platform": "youtube"},
    {"name": "BakeWithBella", "categories": ["food", "lifestyle"], "platform": "tiktok"},
    {"name": "DroneViewDave", "categories": ["travel", "tech"], "platform": "youtube"},
    {"name": "NailArtNina", "categories": ["beauty", "fashion"], "platform": "instagram"},
    {"name": "CodeWithCarla", "categories": ["tech", "lifestyle"], "platform": "youtube"},
    {"name": "SoccerStarSean", "categories": ["sports", "fitness"], "platform": "tiktok"},
    {"name": "VeganVibes", "categories": ["food", "lifestyle"], "platform": "instagram"},
    {"name": "RetroRicky", "categories": ["gaming", "tech"], "platform": "tiktok"},
    {"name": "DanceWithDina", "categories": ["music", "lifestyle"], "platform": "tiktok"},
    {"name": "MinimalMax", "categories": ["fashion", "lifestyle"], "platform": "instagram"},
    {"name": "OutdoorOllie", "categories": ["travel", "fitness"], "platform": "youtube"},
    {"name": "GlamGrace", "categories": ["beauty", "fashion"], "platform": "instagram"},
    {"name": "TechTrendsToby", "categories": ["tech", "gaming"], "platform": "youtube"},
    {"name": "PlantBasedPaul", "categories": ["food", "lifestyle"], "platform": "instagram"},
    {"name": "SkateLifeSara", "categories": ["sports", "lifestyle"], "platform": "tiktok"},
    {"name": "JazzJamieMusic", "categories": ["music", "lifestyle"], "platform": "instagram"},
    {"name": "AsianEatsAmi", "categories": ["food", "travel"], "platform": "tiktok"},
    {"name": "LiftWithLeo", "categories": ["fitness", "sports"], "platform": "youtube"},
    {"name": "VintageViviStyle", "categories": ["fashion", "lifestyle"], "platform": "instagram"},
    {"name": "AIAndrewTech", "categories": ["tech", "lifestyle"], "platform": "youtube"},
    {"name": "SurfSideSally", "categories": ["travel", "sports"], "platform": "instagram"},
    {"name": "ContourQueen", "categories": ["beauty", "fashion"], "platform": "tiktok"},
    {"name": "EsportsEthan", "categories": ["gaming", "tech"], "platform": "tiktok"},
    {"name": "PilatesWithPam", "categories": ["fitness", "lifestyle"], "platform": "instagram"},
    {"name": "StreetStyleSteve", "categories": ["fashion", "lifestyle"], "platform": "tiktok"},
    {"name": "HomeChefHana", "categories": ["food", "lifestyle"], "platform": "youtube"},
    {"name": "MountainMikeAdv", "categories": ["travel", "fitness"], "platform": "youtube"},
    {"name": "LipGlossLily", "categories": ["beauty", "lifestyle"], "platform": "tiktok"},
    {"name": "BasketballBen", "categories": ["sports", "fitness"], "platform": "youtube"},
    {"name": "IndieIndiMusic", "categories": ["music", "lifestyle"], "platform": "instagram"},
    {"name": "SmartHomeSuzy", "categories": ["tech", "lifestyle"], "platform": "youtube"},
    {"name": "PastaMasterPat", "categories": ["food", "lifestyle"], "platform": "instagram"},
    {"name": "CozyKnitKara", "categories": ["fashion", "lifestyle"], "platform": "instagram"},
    {"name": "SpeedRunnerRay", "categories": ["gaming", "tech"], "platform": "tiktok"},
]

BRAND_DATA = [
    {"name": "NovaSkin Cosmetics", "industry": "Beauty", "website": "https://novaskin.example.com"},
    {"name": "FitFuel Nutrition", "industry": "Health & Fitness", "website": "https://fitfuel.example.com"},
    {"name": "TrendWear Co.", "industry": "Fashion", "website": "https://trendwear.example.com"},
    {"name": "ByteGear Electronics", "industry": "Technology", "website": "https://bytegear.example.com"},
    {"name": "Wanderlust Travels", "industry": "Travel", "website": "https://wanderlust-travels.example.com"},
    {"name": "GreenBite Foods", "industry": "Food & Beverage", "website": "https://greenbite.example.com"},
    {"name": "PlayZone Gaming", "industry": "Gaming", "website": "https://playzone.example.com"},
    {"name": "PureGlow Skincare", "industry": "Beauty", "website": "https://pureglow.example.com"},
    {"name": "UrbanThread Apparel", "industry": "Fashion", "website": "https://urbanthread.example.com"},
    {"name": "SoundWave Audio", "industry": "Music & Audio", "website": "https://soundwave.example.com"},
]

CAMPAIGN_DATA = [
    {"title": "Summer Glow Collection Launch", "category": "beauty", "platform": Platform.instagram, "budget": 25000},
    {"title": "30-Day Fitness Challenge", "category": "fitness", "platform": Platform.youtube, "budget": 15000},
    {"title": "Fall Fashion Lookbook", "category": "fashion", "platform": Platform.instagram, "budget": 30000},
    {"title": "New Smartphone Unboxing Series", "category": "tech", "platform": Platform.youtube, "budget": 40000},
    {"title": "Hidden Gems Travel Vlog", "category": "travel", "platform": Platform.youtube, "budget": 20000},
    {"title": "Healthy Recipe Reel Series", "category": "food", "platform": Platform.tiktok, "budget": 12000},
    {"title": "Indie Game Spotlight", "category": "gaming", "platform": Platform.tiktok, "budget": 18000},
    {"title": "Morning Skincare Routine", "category": "beauty", "platform": Platform.tiktok, "budget": 10000},
    {"title": "Streetwear Style Challenge", "category": "fashion", "platform": Platform.tiktok, "budget": 22000},
    {"title": "Wireless Earbuds Review Campaign", "category": "tech", "platform": Platform.youtube, "budget": 35000},
    {"title": "Weekend Getaway Series", "category": "travel", "platform": Platform.instagram, "budget": 28000},
    {"title": "Plant-Based Cooking Masterclass", "category": "food", "platform": Platform.youtube, "budget": 16000},
    {"title": "Gym Essentials Haul", "category": "fitness", "platform": Platform.instagram, "budget": 14000},
    {"title": "Back to School Tech Picks", "category": "tech", "platform": Platform.any, "budget": 20000},
    {"title": "Holiday Gift Guide Collaboration", "category": "lifestyle", "platform": Platform.any, "budget": 50000},
]


def _random_followers():
    tier = random.choice(["nano", "micro", "mid", "macro", "mega"])
    ranges = {
        "nano": (1000, 10000),
        "micro": (10000, 100000),
        "mid": (100000, 500000),
        "macro": (500000, 1000000),
        "mega": (1000000, 5000000),
    }
    lo, hi = ranges[tier]
    return random.randint(lo, hi)


def _random_engagement(followers):
    if followers > 1000000:
        return round(random.uniform(0.005, 0.025), 4)
    elif followers > 100000:
        return round(random.uniform(0.01, 0.04), 4)
    elif followers > 10000:
        return round(random.uniform(0.02, 0.06), 4)
    else:
        return round(random.uniform(0.03, 0.10), 4)


async def seed():
    from app.routers.brands import saved_influencers

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(saved_influencers.create, checkfirst=True)

    async with async_session_factory() as session:
        influencer_profiles = []
        for i, data in enumerate(INFLUENCER_DATA):
            user = User(
                email=f"influencer{i+1}@example.com",
                password_hash=hash_password("password123"),
                role=Role.influencer,
            )
            session.add(user)
            await session.flush()

            followers = _random_followers()
            engagement = _random_engagement(followers)
            avg_likes = int(followers * engagement * random.uniform(0.8, 1.2))
            avg_comments = int(avg_likes * random.uniform(0.01, 0.08))
            authenticity, fake_pct = calculate_authenticity_score(followers, avg_likes, avg_comments, engagement)

            handle_base = data["name"].lower().replace(" ", "")
            profile = InfluencerProfile(
                user_id=user.id,
                display_name=data["name"],
                bio=f"Content creator passionate about {' & '.join(data['categories'])}. Let's collab!",
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/png?seed={handle_base}",
                categories=data["categories"],
                instagram_handle=f"@{handle_base}" if data["platform"] == "instagram" or random.random() > 0.4 else None,
                tiktok_handle=f"@{handle_base}" if data["platform"] == "tiktok" or random.random() > 0.5 else None,
                youtube_handle=f"@{handle_base}" if data["platform"] == "youtube" or random.random() > 0.5 else None,
                follower_count=followers,
                engagement_rate=engagement,
                avg_likes=avg_likes,
                avg_comments=avg_comments,
                audience_top_country=random.choice(COUNTRIES),
                audience_age_range=random.choice(AGE_RANGES),
                audience_gender_split={"male": (m := random.randint(25, 70)), "female": 95 - m, "other": 5},
                authenticity_score=authenticity,
                fake_follower_pct=fake_pct,
                price_per_post=Decimal(str(round(followers * random.uniform(0.005, 0.02), 2))),
                location=random.choice(LOCATIONS),
                is_verified=random.random() > 0.6,
            )
            session.add(profile)
            await session.flush()
            influencer_profiles.append(profile)

        brand_profiles = []
        for i, data in enumerate(BRAND_DATA):
            user = User(
                email=f"brand{i+1}@example.com",
                password_hash=hash_password("password123"),
                role=Role.brand,
            )
            session.add(user)
            await session.flush()

            profile = BrandProfile(
                user_id=user.id,
                company_name=data["name"],
                logo_url=f"https://api.dicebear.com/7.x/initials/png?seed={data['name'].replace(' ', '')}",
                industry=data["industry"],
                website=data["website"],
                description=f"{data['name']} is a leading company in the {data['industry']} industry.",
            )
            session.add(profile)
            await session.flush()
            brand_profiles.append(profile)

        campaigns = []
        for i, data in enumerate(CAMPAIGN_DATA):
            brand = brand_profiles[i % len(brand_profiles)]
            start = date.today() + timedelta(days=random.randint(-30, 30))
            campaign = Campaign(
                brand_id=brand.id,
                title=data["title"],
                description=f"We're looking for talented creators for our {data['title']} campaign. Join us!",
                requirements=f"Must have at least 5K followers. Create 2-3 high-quality posts about {data['category']}.",
                budget=Decimal(str(data["budget"])),
                price_per_influencer=Decimal(str(round(data["budget"] / random.randint(3, 8), 2))),
                category=data["category"],
                min_followers=random.choice([1000, 5000, 10000, 25000]),
                min_engagement_rate=round(random.uniform(0.01, 0.03), 3),
                platform=data["platform"],
                status=random.choice([CampaignStatus.active, CampaignStatus.active, CampaignStatus.active, CampaignStatus.draft]),
                start_date=start,
                end_date=start + timedelta(days=random.randint(14, 60)),
                max_influencers=random.randint(3, 10),
            )
            session.add(campaign)
            await session.flush()
            campaigns.append(campaign)

        for campaign in campaigns:
            num_applicants = random.randint(2, 8)
            applicants = random.sample(influencer_profiles, min(num_applicants, len(influencer_profiles)))
            for inf in applicants:
                app = CampaignApplication(
                    campaign_id=campaign.id,
                    influencer_id=inf.id,
                    status=random.choice([ApplicationStatus.pending, ApplicationStatus.pending, ApplicationStatus.accepted, ApplicationStatus.rejected]),
                    pitch=f"Hi! I'd love to be part of your {campaign.title} campaign. I have {inf.follower_count:,} followers and a {inf.engagement_rate*100:.1f}% engagement rate.",
                )
                session.add(app)

        for brand in brand_profiles:
            saved = random.sample(influencer_profiles, random.randint(2, 6))
            for inf in saved:
                await session.execute(
                    saved_influencers.insert().values(brand_id=brand.id, influencer_id=inf.id)
                )

        await session.commit()

    print(f"Seeded {len(INFLUENCER_DATA)} influencers, {len(BRAND_DATA)} brands, {len(CAMPAIGN_DATA)} campaigns")
    print("All users have password: password123")
    print("Influencer emails: influencer1@example.com .. influencer50@example.com")
    print("Brand emails: brand1@example.com .. brand10@example.com")


if __name__ == "__main__":
    asyncio.run(seed())
