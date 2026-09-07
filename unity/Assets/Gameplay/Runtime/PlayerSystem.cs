using UnityEngine;
using RushRider.Data;

#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace RushRider.Gameplay
{
    public sealed class PlayerSystem : MonoBehaviour, GameManager.IResettable
    {
        [SerializeField] private float forwardSpeed = 14f;
        [SerializeField] private float jumpHeight = 1.1f;
        private PrototypeConfig config;
        private int lane;
        private float lanePosition;
        private float jumpTime;
        private float inputHorizontal;
        private bool inputJump;
        private Vector2 touchStart;
        private bool trackingTouch;

        public int Lane => lane;
        public float Distance { get; private set; }

        public void Initialize(PrototypeConfig value)
        {
            config = value;
            ResetState();
        }

        public void ResetState()
        {
            lane = 0;
            lanePosition = 0f;
            jumpTime = 0f;
            Distance = 0f;
            if (config != null)
                transform.position = new Vector3(0f, 0.5f, 0f);
        }

        private void Update()
        {
            if (config == null)
                return;

            ReadInput();
            if (inputHorizontal < -0.5f && lane > -1) lane--;
            if (inputHorizontal > 0.5f && lane < 1) lane++;
            if (inputJump && jumpTime <= 0f) jumpTime = 0.62f;

            lanePosition = Mathf.MoveTowards(
                lanePosition,
                lane * config.laneSpacing,
                config.laneSpacing * Time.deltaTime / config.laneChangeTime);
            Distance = Mathf.Min(config.routeLength, Distance + forwardSpeed * Time.deltaTime);
            var y = 0.5f;
            if (jumpTime > 0f)
            {
                jumpTime -= Time.deltaTime;
                var normalized = 1f - Mathf.Clamp01(jumpTime / 0.62f);
                y += Mathf.Sin(normalized * Mathf.PI) * jumpHeight;
            }
            transform.position = new Vector3(lanePosition, y, Distance);
        }

        private void ReadInput()
        {
            inputHorizontal = 0f;
            inputJump = false;
#if ENABLE_INPUT_SYSTEM
            if (Keyboard.current != null)
            {
                inputHorizontal = (Keyboard.current.dKey.wasPressedThisFrame || Keyboard.current.rightArrowKey.wasPressedThisFrame ? 1f : 0f)
                    - (Keyboard.current.aKey.wasPressedThisFrame || Keyboard.current.leftArrowKey.wasPressedThisFrame ? 1f : 0f);
                inputJump = Keyboard.current.spaceKey.wasPressedThisFrame;
            }
            var touch = Touchscreen.current != null ? Touchscreen.current.primaryTouch : null;
            if (touch == null)
                return;
            if (touch.press.wasPressedThisFrame)
            {
                touchStart = touch.position.ReadValue();
                trackingTouch = true;
            }
            if (trackingTouch && touch.press.wasReleasedThisFrame)
            {
                var delta = touch.position.ReadValue() - touchStart;
                trackingTouch = false;
                if (Mathf.Abs(delta.x) > Mathf.Abs(delta.y) && Mathf.Abs(delta.x) >= 30f)
                    inputHorizontal = Mathf.Sign(delta.x);
                else if (delta.y >= 30f)
                    inputJump = true;
            }
#else
            inputHorizontal = Input.GetAxisRaw("Horizontal");
            inputJump = Input.GetKeyDown(KeyCode.Space);
#endif
        }
    }
}