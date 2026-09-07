using UnityEngine;
using RushRider.Data;

namespace RushRider.Gameplay
{
    public sealed class GameManager : MonoBehaviour
    {
        public PrototypeConfig Config { get; private set; }
        public bool IsRunning { get; private set; }
        public int ResetCount { get; private set; }

        public void Initialize(PrototypeConfig config)
        {
            Config = config != null ? config : PrototypeConfig.CreateDefault();
            ResetRun();
        }

        public void BeginRun()
        {
            IsRunning = true;
        }

        public void ResetRun()
        {
            IsRunning = false;
            ResetCount++;
            foreach (var resettable in GetComponentsInChildren<IResettable>(true))
                resettable.ResetState();
        }

        public interface IResettable
        {
            void ResetState();
        }
    }
}