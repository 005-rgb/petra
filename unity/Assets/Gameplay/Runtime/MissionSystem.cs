using UnityEngine;
using RushRider.Data;

namespace RushRider.Gameplay
{
    public sealed class MissionSystem : MonoBehaviour, GameManager.IResettable
    {
        public float Elapsed { get; private set; }
        public bool PickedUp { get; private set; }
        public bool Delivered { get; private set; }
        private PrototypeConfig config;
        private PlayerSystem player;

        public void Initialize(PrototypeConfig value, PlayerSystem playerSystem)
        {
            config = value;
            player = playerSystem;
            ResetState();
        }

        public void ResetState()
        {
            Elapsed = 0f;
            PickedUp = false;
            Delivered = false;
        }

        private void Update()
        {
            if (player == null || Delivered) return;
            Elapsed += Time.deltaTime;
            if (!PickedUp && player.Distance >= config.pickupAt) PickedUp = true;
            if (PickedUp && player.Distance >= config.routeLength) Delivered = true;
            if (Elapsed > config.timeLimit) enabled = false;
        }
    }
}