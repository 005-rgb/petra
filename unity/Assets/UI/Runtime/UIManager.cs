using UnityEngine;
using RushRider.Gameplay;

namespace RushRider.UI
{
    public sealed class UIManager : MonoBehaviour
    {
        private PlayerSystem player;
        private MissionSystem mission;

        public void Initialize(PlayerSystem playerSystem, MissionSystem missionSystem)
        {
            player = playerSystem;
            mission = missionSystem;
        }

        private void OnGUI()
        {
            if (player == null || mission == null) return;
            var style = new GUIStyle(GUI.skin.label) { fontSize = 20 };
            GUI.Label(new Rect(16, 16, 480, 32), $"RUSH RIDER  DIST {player.Distance:000}m  TIME {mission.Elapsed:0.0}s", style);
            GUI.Label(new Rect(16, 44, 480, 32), mission.Delivered ? "DELIVERY COMPLETE" : mission.PickedUp ? "ORDER IN TRANSIT" : "GO TO PICKUP", style);
        }
    }
}