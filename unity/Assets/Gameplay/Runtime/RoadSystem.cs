using UnityEngine;
using RushRider.Data;

namespace RushRider.Gameplay
{
    public sealed class RoadSystem : MonoBehaviour
    {
        [SerializeField] private Material roadMaterial;
        private const float SegmentLength = 24f;

        public void Build(PrototypeConfig config)
        {
            for (var i = 0; i < Mathf.CeilToInt(config.routeLength / SegmentLength); i++)
            {
                var segment = GameObject.CreatePrimitive(PrimitiveType.Cube);
                segment.name = $"RoadSegment_{i:000}";
                segment.transform.SetParent(transform);
                segment.transform.position = new Vector3(0f, -0.05f, i * SegmentLength + SegmentLength / 2f);
                segment.transform.localScale = new Vector3(9f, 0.1f, SegmentLength);
                if (roadMaterial != null)
                    segment.GetComponent<Renderer>().sharedMaterial = roadMaterial;
            }
        }
    }
}