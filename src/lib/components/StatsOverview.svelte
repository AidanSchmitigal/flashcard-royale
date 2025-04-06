<!-- src/lib/components/StatsOverview.svelte -->
<script lang="ts">
	import type { Stats } from '$lib/client/types';

	const { stats }: { stats: Stats } = $props();

	// Calculate win rate
	const winRate = (stats.gamesWon / stats.gamesPlayed) * 100 || 0;
</script>

<div class="stats-overview">
	<div class="stats-header">
		<h2>Game Statistics</h2>
		<span class="xp-level">Level {stats.level} • {stats.xp} XP</span>
	</div>

	<div class="stat-cards">
		<div class="stat-card">
			<div class="stat-value">{stats.gamesPlayed}</div>
			<div class="stat-label">Games Played</div>
		</div>

		<div class="stat-card">
			<div class="stat-value">{stats.gamesWon}</div>
			<div class="stat-label">Games Won</div>
		</div>

		<div class="stat-card">
			<div class="stat-value">{stats.gamesLost}</div>
			<div class="stat-label">Games Lost</div>
		</div>

		<div class="stat-card">
			<div class="stat-value">{stats.gamesDraw}</div>
			<div class="stat-label">Games Draw</div>
		</div>
	</div>

	<div class="win-rate-container">
		<div class="win-rate-label">Win Rate</div>
		<div class="win-rate-bar">
			<div class="win-rate-progress" style="width: {winRate}%"></div>
		</div>
		<div class="win-rate-percentage">{winRate.toFixed(1)}%</div>
	</div>
</div>

<style>
	.stats-overview {
		background-color: #fff;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.stats-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.stats-header h2 {
		margin: 0;
	}

	.xp-level {
		background-color: #3498db;
		color: white;
		padding: 5px 15px;
		border-radius: 20px;
		font-weight: bold;
	}

	.stat-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 15px;
		margin-bottom: 30px;
	}

	.stat-card {
		background-color: #f8f8f8;
		border-radius: 8px;
		padding: 15px;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.stat-value {
		font-size: 2rem;
		font-weight: bold;
		color: #3498db;
	}

	.stat-label {
		color: #777;
		margin-top: 5px;
	}

	.win-rate-container {
		margin-bottom: 30px;
	}

	.win-rate-label {
		font-weight: bold;
		margin-bottom: 5px;
	}

	.win-rate-bar {
		height: 10px;
		background-color: #eee;
		border-radius: 5px;
		overflow: hidden;
		margin-bottom: 5px;
	}

	.win-rate-progress {
		height: 100%;
		background-color: #2ecc71;
	}

	.win-rate-percentage {
		text-align: right;
		font-weight: bold;
	}

	.achievements-section {
		margin-bottom: 30px;
	}

	.achievements-section h3 {
		margin-bottom: 10px;
	}

	.achievement-progress {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.progress-text {
		text-align: right;
		font-weight: bold;
	}

	.progress-bar {
		height: 8px;
		background-color: #eee;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress {
		height: 100%;
		background-color: #f39c12;
	}

	.game-breakdown h3 {
		margin-bottom: 15px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	table th,
	table td {
		padding: 10px;
		text-align: left;
		border-bottom: 1px solid #eee;
	}

	table th {
		font-weight: bold;
		color: #555;
	}
</style>
