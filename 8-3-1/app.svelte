<script>
    let numbers = [];
    let number = 0;
    let sum = 0;
    let total = 0;
    let avg = 0;

    const addToList = () => {
        if (number) {
            numbers = [...numbers, number];
            number = 0;
        }
        // Update statistics after adding a number
        updateStatistics();
    };

    const updateStatistics = () =>{
        for (let number of numbers) {
            total += 1;
            sum += number;
        }

        avg = sum/total;

    }


    // $: sum =


</script>

<h1>Statistics generator</h1>

<input type="number" bind:value={number}/>
<button on:click={addToList}>Add value</button>

<h2>Statistics</h2>

<p>Sum: {sum}</p>
<p>Total numbers: {total}</p>
<p>Average: {avg}</p>

<h2>Numbers entered so far</h2>

<ul>
    {#each numbers as num}
        <li>{num}</li>
    {/each}
</ul>