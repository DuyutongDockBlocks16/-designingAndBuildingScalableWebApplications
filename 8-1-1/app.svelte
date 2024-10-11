<script>
    let list = ["Never", "gonna", "give", "you", "up"];
    let index = 0;

    const updateIndex = () => {
        index++;
        index = index === 5 ? 0 : index;
    };
</script>

<h1>{list[index]}</h1>
<button on:click={updateIndex}>Next!</button>