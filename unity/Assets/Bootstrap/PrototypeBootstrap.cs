using UnityEngine;
using RushRider.Data;
using RushRider.Gameplay;
using RushRider.UI;
using RushRider.Tools;

namespace RushRider.Bootstrap
{
    public sealed class PrototypeBootstrap : MonoBehaviour
    {
        [SerializeField] private PrototypeConfig config;

        private void Awake()
        {
            var resolvedConfig = config != null ? config : PrototypeConfig.CreateDefault();
            var manager = gameObject.AddComponent<GameManager>();
            manager.Initialize(resolvedConfig);

            var playerObject = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            playerObject.name = "Player_Prototype";
            playerObject.transform.position = new Vector3(0f, 0.5f, 0f);
            var player = playerObject.AddComponent<PlayerSystem>();
            player.Initialize(resolvedConfig);

            var road = new GameObject("RoadSystem").AddComponent<RoadSystem>();
            road.Build(resolvedConfig);

            var traffic = new GameObject("TrafficSystem").AddComponent<TrafficSystem>();
            traffic.Initialize(resolvedConfig, player.transform);

            var mission = new GameObject("MissionSystem").AddComponent<MissionSystem>();
            mission.Initialize(resolvedConfig, player);

            var save = new GameObject("SaveSystem").AddComponent<SaveSystem>();
            save.name = "SaveSystem";

            var ui = new GameObject("UIManager").AddComponent<UIManager>();
            ui.Initialize(player, mission);

            var debug = new GameObject("DebugOverlay").AddComponent<DebugOverlay>();
            debug.Initialize(player);

            var cameraObject = new GameObject("PrototypeCamera");
            var camera = cameraObject.AddComponent<Camera>();
            cameraObject.transform.position = new Vector3(0f, 16f, -18f);
            cameraObject.transform.rotation = Quaternion.Euler(40f, 0f, 0f);
            var follow = cameraObject.AddComponent<PrototypeCameraFollow>();
            follow.Initialize(player.transform);
            manager.BeginRun();
        }
    }

    public sealed class PrototypeCameraFollow : MonoBehaviour
    {
        private Transform target;
        public void Initialize(Transform value) => target = value;

        private void LateUpdate()
        {
            if (target == null) return;
            transform.position = new Vector3(target.position.x, 16f, target.position.z - 18f);
            transform.rotation = Quaternion.Euler(40f, 0f, 0f);
        }
    }
}