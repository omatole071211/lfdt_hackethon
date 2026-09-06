# CampusSpace / RoomRadar Database Directory

This directory contains the master dataset for all campus buildings, rooms, labs, and timetables.

## Files

1. **`Engineering_Timetables (1).xlsx`**: Master Excel spreadsheet containing raw timetable extractions, subjects, faculty names, time slots, and room codes across engineering branches.
2. **`schedules.json`**: Parsed and normalized schedule slots (1,029 slots) with 24-hour time ranges (`startTime`, `endTime`), days of the week, faculty names, subject codes/names, and division batch details.
3. **`rooms.json`**: 118 normalized room and lab records linked to building IDs (`bld-5`, `bld-6`, `bld-9`) and floor numbers (Ground Floor - Floor 5).

## Building Classification & Schema

| Building ID | Building Name | Code | Number Prefix | Closing Time |
| :--- | :--- | :--- | :--- | :--- |
| `bld-5` | 5th Building - Computer / IT Department | `BLD-5` | `5` | 6:10 PM (`18:10`) |
| `bld-6` | 6th Building - Computer Department | `BLD-6` | `6` | 5:10 PM (`17:10`) |
| `bld-9` | 9th Building - Mechanical Department | `BLD-9` | `9` | 6:10 PM (`18:10`) |

### Room Code Structure
- **1st Digit**: Building Number (`5`, `6`, `9`).
- **2nd Digit**: Floor Number (`0` for Ground Floor, `1`, `2`, `3`, `4`, `5`).
- **Suffix / Remaining**: Room or Lab Number (e.g. `01`, `02`, `04`, `16`, `CR` for Classroom, `LA` for Lab).
