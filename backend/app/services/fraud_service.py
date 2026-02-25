def calculate_authenticity_score(
    follower_count: int,
    avg_likes: int,
    avg_comments: int,
    engagement_rate: float,
) -> tuple[float, float]:
    """Calculate authenticity score and fake follower percentage.

    Returns (authenticity_score 0-100, fake_follower_pct 0-100).
    """
    if follower_count == 0:
        return 50.0, 50.0

    like_ratio = avg_likes / follower_count
    score = 50.0

    # Engagement rate check (healthy: 1-6%)
    if 0.01 <= engagement_rate <= 0.06:
        score += 15
    elif 0.005 <= engagement_rate <= 0.10:
        score += 8
    elif engagement_rate > 0.15:
        score -= 10
    else:
        score -= 5

    # Like-to-follower ratio (healthy: 1-5%)
    if 0.01 <= like_ratio <= 0.05:
        score += 15
    elif 0.005 <= like_ratio <= 0.08:
        score += 8
    else:
        score -= 5

    # Comment-to-like ratio (healthy: 1-5%)
    if avg_likes > 0:
        comment_to_like = avg_comments / avg_likes
        if 0.01 <= comment_to_like <= 0.05:
            score += 10
        elif 0.005 <= comment_to_like <= 0.10:
            score += 5
        elif comment_to_like > 0.20:
            score -= 10
        else:
            score -= 3

    # Size-based adjustment
    if follower_count > 1_000_000:
        score += 5
    elif follower_count < 1_000:
        score -= 5

    score = max(0, min(100, score))
    fake_pct = max(0, min(100, 100 - score))

    return round(score, 1), round(fake_pct, 1)
