<script>
    let typedContent = '';
</script>

<input bind:value={typedContent} />

<p>Total characters: {typedContent.length}.</p>