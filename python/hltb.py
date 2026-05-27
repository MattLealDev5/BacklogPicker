import sys
import json
from howlongtobeatpy import HowLongToBeat

def fetchGame(gameName):
    results = HowLongToBeat().search(gameName)
    if len(results) > 0:
        best = results[0]
        print(json.dumps({
            "game_id": best.game_id,
            "game_name": best.game_name,
            "game_alias": best.game_alias,
            "game_type": best.game_type,
            "game_image_url": best.game_image_url,
            "game_web_link": best.game_web_link,
            "review_score": best.review_score,
            "profile_dev": best.profile_dev,
            "profile_platforms": best.profile_platforms,
            "release_world": best.release_world,
            "similarity": best.similarity,
            "json_content": best.json_content,
            "main_story": best.main_story,
            "main_extra": best.main_extra,
            "completionist": best.completionist,
            "all_styles": best.all_styles,
            "coop_time": best.coop_time,
            "mp_time": best.mp_time,
            "complexity_lvl_combine": best.mp_time,
            "complexity_lvl_sp": best.mp_time,
            "complexity_lvl_co": best.mp_time,
            "complexity_lvl_mp": best.mp_time
        }))
    else:
        print(json.dumps({"message": "No games found :("}))

gameName = sys.argv[1]
fetchGame(gameName)