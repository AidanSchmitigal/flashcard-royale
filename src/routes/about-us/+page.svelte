<script lang="ts">
    // About us page component
</script>

<svelte:head>
    <title>About Us - Flashcard Royale</title>
    <meta name="description" content="Learn about the team behind Flashcard Royale" />
</svelte:head>

<div class="max-w-3xl mx-auto p-8 text-blue-900">
    <h1 class="text-center text-3xl font-bold mb-8 text-blue-800">About Flashcard Royale</h1>
    
    <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-blue-700">Our Mission</h2>
        <p class="leading-relaxed">
            At Flashcard Royale, we're dedicated to making learning fun and competitive.
            We believe that the best way to learn is through engagement, challenge, and friendly competition.
        </p>
    </section>
    
    <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-blue-700">Our Team</h2>
        <p class="leading-relaxed">
            Flashcard Royale was created by a team of students at Oregon State University
            who are passionate about education and gamification. We developed this platform
            during a hackathon to revolutionize how people learn and retain information.
        </p>
    </section>
    
    <section class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-blue-700">How It Works</h2>
        <p class="leading-relaxed">
            Our platform combines traditional flashcard learning with battle royale game mechanics.
            Create your own card decks or use our premade collections, then challenge others
            to see who has the best knowledge retention and speed.
        </p>
    </section>
</div>

<style>
    .about-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        color: #003366;
    }
    
    h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: #004488;
    }
    
    .about-section {
        margin-bottom: 2rem;
    }
    
    h2 {
        color: #0066cc;
        margin-bottom: 1rem;
    }
    
    p {
        line-height: 1.6;
    }
</style>
