from howlongtobeatpy import HowLongToBeat

def fetchGame(gameName):
    results = HowLongToBeat().search(gameName)
    if len(results) > 0:
        print(results[0].game_name)
        print("Main Story:   %.2f hours" %(results[0].main_story))
        print("Side Content: %.2f hours" %(results[0].main_extra))

if __name__ == "__main__":
    fetchGame("Nuclear Throne")