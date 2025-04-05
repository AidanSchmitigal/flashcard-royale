<!-- src/lib/components/GameHistoryCard.svelte -->
<script>
	export let game;

	// Calculate if the user won
	$: isWin = game.result === 'win';
	$: isDraw = game.result === 'draw';
</script>

<div class="game-card" class:win={isWin} class:loss={!isWin && !isDraw} class:draw={isDraw}>
	<div class="game-info">
		<div class="game-header">
			<h3>{game.gameName}</h3>
			<span class="date">{new Date(game.playedAt).toLocaleDateString()}</span>
		</div>

		<div class="result-badge">
			{#if isWin}
				<span class="win-badge">WIN</span>
			{:else if isDraw}
				<span class="draw-badge">DRAW</span>
			{:else}
				<span class="loss-badge">LOSS</span>
			{/if}
		</div>
	</div>

	<div class="stats-row">
		<div class="stat">
			<span class="label">Score</span>
			<span class="value">{game.score}</span>
		</div>
		<div class="stat">
			<span class="label">Time</span>
			<span class="value">{game.playTime}</span>
		</div>
		<div class="stat">
			<span class="label">XP Earned</span>
			<span class="value">+{game.xpEarned}</span>
		</div>
	</div>

	{#if game.achievements && game.achievements.length > 0}
		<div class="achievements">
			<h4>Achievements</h4>
			<div class="achievement-list">
				{#each game.achievements as achievement}
					<div class="achievement-item" title={achievement.description}>
						<span class="achievement-icon">{achievement.icon}</span>
						<span class="achievement-name">{achievement.name}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.game-card {
		background-color: #f8f8f8;
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 15px;
		border-left: 5px solid #ccc;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.game-card.win {
		border-left-color: #2ecc71;
	}

	.game-card.loss {
		border-left-color: #e74c3c;
	}

	.game-card.draw {
		border-left-color: #f39c12;
	}

	.game-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.game-header h3 {
		margin: 0;
	}

	.date {
		color: #777;
		font-size: 0.9rem;
	}

	.result-badge span {
		padding: 3px 10px;
		border-radius: 12px;
		font-weight: bold;
		font-size: 0.8rem;
	}

	.win-badge {
		background-color: rgba(46, 204, 113, 0.2);
		color: #2ecc71;
	}

	.loss-badge {
		background-color: rgba(231, 76, 60, 0.2);
		color: #e74c3c;
	}

	.draw-badge {
		background-color: rgba(243, 156, 18, 0.2);
		color: #f39c12;
	}

	.stats-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.label {
		font-size: 0.8rem;
		color: #777;
	}

	.value {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.achievements h4 {
		margin-bottom: 8px;
		font-size: 0.9rem;
		color: #555;
	}

	.achievement-list {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.achievement-item {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 5px 10px;
		border-radius: 15px;
		font-size: 0.8rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.achievement-icon {
		margin-right: 5px;
	}
</style>
