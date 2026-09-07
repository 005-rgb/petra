using UnityEngine;
using RushRider.Data;

namespace RushRider.Gameplay
{
    public sealed class TrafficSystem : MonoBehaviour, GameManager.IResettable
    {
        private PrototypeConfig config;
        private Transform player;
        private readonly System.Collections.Generic.List<GameObject> pool =
            new System.Collections.Generic.List<GameObject>();

        public void Initialize(PrototypeConfig value, Transform playerTransform)
        {
            config = value;
            player = playerTransform;
            for (var i = 0; i < config.maxTraffic; i++)
            {
                var vehicle = GameObject.CreatePrimitive(PrimitiveType.Cube);
                vehicle.name = $"Traffic_{i:00}";
                vehicle.transform.SetParent(transform);
                vehicle.transform.localScale = new Vector3(1.4f, 0.8f, 2.6f);
                vehicle.SetActive(false);
                pool.Add(vehicle);
            }
            ResetState();
        }

        public void ResetState()
        {
            for (var i = 0; i < pool.Count; i++)
            {
                var vehicle = pool[i];
                vehicle.SetActive(i < Mathf.Min(8, pool.Count));
                vehicle.transform.position = new Vector3(((i % 3) - 1) * config.laneSpacing, 0.4f, 40f + i * 55f);
            }
        }

        private void Update()
        {
            if (player == null) return;
            foreach (var vehicle in pool)
            {
                if (!vehicle.activeSelf) continue;
                if (vehicle.transform.position.z < player.position.z - 30f)
                    vehicle.transform.position += Vector3.forward * config.routeLength;
            }
        }
    }
}