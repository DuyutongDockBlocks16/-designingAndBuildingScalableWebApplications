<script>
    export let addtext;

    let text = "";

    const textProcess = () => {
        if (text.length === "0") {
            return;
        }

        addtext(text);
        text = "";
    }


</script>

<input bind:value={text} />
<button on:click={textProcess}>Add text</button>