# Unity bootstrap template

This directory contains the dependency-light runtime foundation for the
addendum. It is intentionally kept separate from the browser reference build.
The exact Unity editor patch, Android SDK/NDK/JDK versions, and Unity-generated
`ProjectVersion.txt` remain an explicit approval gate in
`config/addendum/project-lock.json`; no version is guessed here.

## Bootstrap

1. Approve and record the exact Unity LTS patch in `config/addendum/project-lock.json`.
2. Open a new Unity project at the approved patch.
3. Copy `unity/Assets` and `unity/Packages` into that project.
4. Configure Android Build Support and record SDK/NDK/JDK versions in the lock.
5. Open `Assets/Scenes/Prototype_Level01.unity` and run the scene.
6. Build Android Build 0, then proceed through the addendum build ladder.

The scripts are designed to compile with the Input System package and URP. The
repository validator deliberately reports the missing editor lock and physical
captures as blockers until those actions are performed on real tooling.