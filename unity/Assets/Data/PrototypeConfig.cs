using UnityEngine;

namespace RushRider.Data
{
    [CreateAssetMenu(menuName = "Rush Rider/Prototype Config")]
    public sealed class PrototypeConfig : ScriptableObject
    {
        [Min(1)] public float routeLength = 960f;
        [Min(1)] public float timeLimit = 90f;
        [Min(0.1f)] public float laneSpacing = 2.4f;
        [Min(0.01f)] public float laneChangeTime = 0.22f;
        [Min(1)] public int playerHp = 100;
        [Min(0)] public float pickupAt = 140f;
        [Min(1)] public float targetTime = 75f;
        [Range(20, 120)] public int floorFps = 30;
        [Range(30, 120)] public int targetFps = 60;
        [Range(1, 100)] public int maxTraffic = 32;
        [Range(1, 100)] public int maxObstacles = 24;

        public static PrototypeConfig CreateDefault()
        {
            var config = CreateInstance<PrototypeConfig>();
            return config;
        }
    }
}