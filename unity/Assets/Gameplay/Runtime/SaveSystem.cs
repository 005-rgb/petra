using UnityEngine;

namespace RushRider.Gameplay
{
    public sealed class SaveSystem : MonoBehaviour
    {
        private const string CashKey = "rush_rider_cash";
        private const string StarsKey = "rush_rider_stars_level01";

        public int Cash => PlayerPrefs.GetInt(CashKey, 0);
        public int Stars => PlayerPrefs.GetInt(StarsKey, 0);

        public void SaveResult(int cash, int stars)
        {
            PlayerPrefs.SetInt(CashKey, Mathf.Max(Cash, cash));
            PlayerPrefs.SetInt(StarsKey, Mathf.Max(Stars, stars));
            PlayerPrefs.Save();
        }

        public void ClearForDevelopment()
        {
            PlayerPrefs.DeleteKey(CashKey);
            PlayerPrefs.DeleteKey(StarsKey);
            PlayerPrefs.Save();
        }
    }
}