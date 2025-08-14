# Booking Website
This is a custom-built booking system I created for a friend to manage and schedule appointments.
It is currently live and in use by their business to streamline client bookings.

# Features
	-	Appointment Fetching – Pulls available appointment slots from the database.
	-	Month & Week Filtering – Grouped by month and week for easy navigation.
	-	Dynamic Date Selection – Days automatically update based on the chosen week.
	-	Real-Time Updates – Data is fetched fresh from the backend so schedules stay current.
	-	User-Friendly Dropdowns – Simple, clean UI for selecting months, weeks, and specific dates.

# Tech Stack
	-	React (with hooks for state and side effects)
    -   CSS styling
    -   supabase (PostgreSQL)

# How it works
    1.	Data Fetching
	    -   The app queries the backend for all appointments.
	2.	Data Grouping
	    -	Appointments are grouped by Month → Week → Day for easy dropdown navigation.
	3.	User Selection Flow
	    -	Select a month → weeks for that month populate automatically.
	    -	Select a week → available dates for that week appear.
	    -	Select a date → choose a time slot and confirm.
        -   Upon confirmation QR code for payments is shown for deposits

# link:
https://willow-and-weave.netlify.app/ 
    