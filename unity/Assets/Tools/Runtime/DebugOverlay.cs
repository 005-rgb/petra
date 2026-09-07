using UnityEngine;
using RushRider.Gameplay;

#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace RushRider.Tools
{
    public sealed class DebugOverlay : MonoBehaviour
    {
        private PlayerSystem player;
        private bool visible = true;

        public void Initialize(PlayerSystem playerSystem)
        {
            player = playerSystem;
        }

        private void Update()
        {
            if (TogglePressed()) visible = !visible;
        }

        private static bool TogglePressed()
        {
#if ENABLE_INPUT_SYSTEM
            return Keyboard.current != null && Keyboard.current.f3Key.wasPressedThisFrame;
#else
            return Input.GetKeyDown(KeyCode.F3);
#endif
        }

        private void OnGUI()
        {
            if (!visible || player == null) return;
            var style = new GUIStyle(GUI.skin.label) { fontSize = 14, normal = { textColor = Color.yellow } };
            GUI.Label(new Rect(16, Screen.height - 72, 620, 24), $"DEBUG  FPS {1f / Mathf.Max(Time.unscaledDeltaTime, 0.001f):0}  OBJECTS {FindObjectsOfType<GameObject>().Length}", style);
            GUI.Label(new Rect(16, Screen.height - 48, 620, 24), "F3 overlay  |  Space jump  |  A/D or arrows lane", style);
        }
    }
}