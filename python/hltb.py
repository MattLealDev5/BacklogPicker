import sys
import json
import game_hltb
from howlongtobeatpy import HowLongToBeat

def fetchGame(gameName, limit):
    results = HowLongToBeat().search(gameName)
    if len(results) > 0:
        for entry in results[:limit]:
            print(json.dumps(game_hltb.game_hltb(entry).__dict__))
    else:
        print(json.dumps({"message": "No games found :("}))

gameName = "Nuclear Throne"
limit = 1

if len(sys.argv) > 1:
    gameName = sys.argv[1]
if len(sys.argv) > 2:
    try:
        parsedInt = int(sys.argv[2])
        limit = parsedInt
    except:
        print("not an integer")
fetchGame(gameName, limit)