# VetSim Frontend — Claude Context

## UI Visual Quality

Room scene completely overhauled — cartoon SVG room replaced with a single illustrated background image (room_background.png). Cartoon dog replaced with realistic illustrated PNGs: pepper_room.png (French Bulldog, transparent background) and biscuit_room.png (Labrador, transparent background, scaleX(-1) to face left). PatientDog function in RoomScene.js selects image by breed prop.

Owner characters replaced with illustrated PNGs — 5 mood states each: James Okafor (derm_001): neutral, frustrated, skeptical, engaged, relieved. Sarah Chen (gdv_001): panicked, desperate, anxious, relieved, grateful. SeatedOwner in RoomFigures.js selects image by caseId + mood prop. Sarah renders at width 200, James at width 250.

Vet tech replaced with illustrated PNGs — 5 mood states: tech_neutral_ready, tech_focused, tech_concerned, tech_urgent, tech_reassuring. VetTechFigure in RoomProps.js selects by mood prop.

Both SeatedOwner and VetTechFigure now receive mood={emotion} from RoomScene so they respond to live emotional state.

Coded poster overlay removed — background image contains poster.
ExamTable and RollingStool hidden with display:none — background image contains them visually.

### Known issues for next session
- Background image has dog lying on table — needs regeneration with empty table
- Background image has door window — needs removal
- Background image has ECG machine — needs removal
- Character positioning still needs fine-tuning
- Patient status panel overlaps right side on some screen sizes

## Priority Sequencing

Next session: regenerate room_background.png (empty table, no door window, no ECG), then fine-tune character positions.
