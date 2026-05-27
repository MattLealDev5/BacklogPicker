import sys
import json
from howlongtobeatpy import HowLongToBeat

def fetchGame(gameName):
    results = HowLongToBeat().search(gameName)
    if len(results) > 0:
        best = results[0]
        print(json.dumps({
            "game_name": best.game_name,
            "main_story": best.main_story,
            "main_extra": best.main_extra,
            "completionist": best.completionist
        }))

gameName = sys.argv[1]
fetchGame(gameName)