one_day = {
    "Full Body": [
    {"Squats": "2 sets of 20 reps"},
    {"Barbell Rows or Seated Cable Rows": "4 sets of 5-12 reps"},
    {"Bench Press": "4 sets of 5-12 reps"},
    {"Leg Curls": "4 sets of 8-15 reps"},
    {"Seated Arnold Press": "4 sets of 5-12 reps"},
    {"Dips": "4 sets of as many reps as possible (AMAP)"},
    {"Chin Ups or Barbell Curls": "4 sets of 5-12 reps (as many reps as possible if doing chin-ups)"}
    ]
}

two_day = {
    "Upper": [
        {"Bench Press (Dumbbell)": "3 sets of 8-12 reps"},
        {"Bent Over Row (Barbell)": "3 sets of 6-10 reps"},
        {"Seated Shoulder Press (Machine)": "3 sets of 10-15 reps"},
        {"Lat Pulldown (Cable)": "3 sets of 12-15 reps"},
        {"Cable Fly Crossovers": "3 sets of 15-20 reps"},
        {"Lateral Raise (Dumbbell)": "2-3 sets of 15-20 reps"},
        {"Concentration Curl": "2 sets of 12-20 reps"},
        {"Triceps Rope Pushdown": "2 sets of 12-20 reps"}
    ],
    "Lower": [
        {"Squat (Barbell)": "3 sets of 6-10 reps"},
        {"Romanian Deadlift (Dumbbell)": "3 sets of 8-12 reps"},
        {"Lunge (Dumbbell)": "3 sets of 16-30 reps (total)"},
        {"Lying Leg Curl (Machine)": "3 sets of 12-15 reps (total)"},
        {"Single Leg Hip Thrust": "3 sets of 6-15 reps"},
        {"Leg Extension (Machine)": "3 sets of 12-20 reps"},
        {"Seated Calf Raise": "3 sets of 10-20 reps"}
    ]
}


three_day = {
    "Chest Shoulders & Triceps": [
            {"Bench Press": "3 sets of 6-8 reps"},
            {"Incline Dumbbell Press": "3 sets of 8-12 reps"},
            {"Cable Crossovers": "3 sets of 8-12 reps"}, 
            {"Overhead Press": "3 sets of 8-12 reps"},
            {"Lateral Raises": "3 sets of 8-12 reps"},
            {"Skullcrushers": "3 sets of 8-12 reps"},
            {"Triceps Rope Pressdown": "3 sets of 8-12 reps"}
            ],
    "Back and Biceps": [
            {"Cable Row": "3 sets of 8-12 reps"},
            {"Lat Pulldown": "3 sets of 8-12 reps"},
            {"Bent Over Flies": "3 sets of 8-12 reps"},
            {"Hyperextensions": "3 sets of 8-12 reps"},
            {"Bicep Barbell Curls": "3 sets of 8-12 reps"},
            {"Hammer Curls": "3 sets of 8-12 reps"}
    ],
    "Legs and Core": [
            {"Squat": "3 sets of 6-8 reps"},
            {"Leg Press": "3 sets of 8-12 reps"},
            {"Leg Extension": "3 sets of 8-12 reps"},
            {"Leg Curl": "3 sets of 8-12 reps"},
            {"Standing Calf Raises": "3 sets of 8-12 reps"},
            {"Plank": "3 sets of 30-60 seconds"},
            {"Crunch": "3 sets of 15-20 reps"}
    ]
}


four_day = {
    "Back & Biceps": [
        {"Deadlift": "2 sets of 5 reps"},
        {"One Arm Dumbbell Row": "3 sets of 8-12 reps"},
        {"Wide Grip Pull Up or Lat Pull Down": "3 sets of 10-12 reps"},
        {"Barbell Row": "3 sets of 8-12 reps"},
        {"Seated Cable Row or Machine Row": "5 minutes (Burn)"},
        {"EZ Bar Preacher Curl": "3 sets of 10-12 reps"},
        {"Concentration Curl": "3 sets of 10-12 reps"},
        {"Seated Dumbbell Curl": "5 minutes (Burn)"}
    ],
    "Chest & Triceps": [
        {"Bench Press": "3 sets of 6-10 reps"},
        {"Incline Dumbbell Bench Press": "3 sets of 8-12 reps"},
        {"Chest Dip": "3 sets of AMRAP (As many reps as possible)"},
        {"Cable Crossover or Pec Dec": "3 sets of 12-15 reps"},
        {"Machine Press or Dumbbell Bench Press": "5 minutes (Burn)"},
        {"EZ Bar Skullcrusher": "3 sets of 8-12 reps"},
        {"Two Arm Seated Dumbbell Extension": "3 sets of 8-12 reps"},
        {"Cable Tricep Extension": "5 minutes (Burn)"}
    ],
    "Quads, Hamstrings, and Calves": [
        {"Squat": "3 sets of 6-10 reps"},
        {"Leg Press": "3 sets of 15-20 reps"},
        {"Hack Squat or Dumbbell Lunge": "3 sets of 8-12 reps"},
        {"Leg Extension": "5 minutes (Burn)"},
        {"Stiff Leg Deadlift": "3 sets of 8-12 reps"},
        {"Leg Curl": "5 minutes (Burn)"},
        {"Standing Calf Raise": "3 sets of 10-15 reps"},
        {"Seated Calf Raise": "5 minutes (Burn)"}
    ],
    "Shoulders, Traps, and Forearms": [
        {"Seated Barbell Press": "3 sets of 6-10 reps"},
        {"Seated Arnold Press": "3 sets of 8-12 reps"},
        {"Dumbbell Lateral Raise": "3 sets of 10-15 reps"},
        {"Hammer Strength Press or Smith Press": "5 minutes (Burn)"},
        {"Upright Row": "3 sets of 8-12 reps"},
        {"Barbell Shrug or Dumbbell Shrug": "5 minutes (Burn)"},
        {"Seated Barbell Wrist Curl": "3 sets of 12-15 reps"},
        {"Barbell Static Hold": "5 minutes (Burn)"}
    ]
}

def get_workout(days):
    if days == 1:
        return one_day
    elif days == 2:
        return two_day
    elif days == 3:
        return three_day
    else: return four_day