<script>
  import Pause from 'carbon-icons-svelte/lib/PauseOutlineFilled32';
  import Play from 'carbon-icons-svelte/lib/PlayOutlineFilled32';
  import { capitalizeFirstLetter, simpleTranslate } from '../utility.js';
  import tooltip from '../tooltip.js';

  export let name;
  export let particlesPaused;

  function handleKeydown(e) {
    if (!(e.code === 'Space' || e.code === 'Enter')) return;

    particlesPaused = !particlesPaused
  }
</script>

<section
  on:click={() => particlesPaused = !particlesPaused}
  on:keydown={handleKeydown}
  use:tooltip={{ content: 'Pause/play animation', placement: 'top'}}
  tabindex="0"
>
  <h3>{capitalizeFirstLetter(simpleTranslate(name))}</h3>
  <!-- Classes instead of if/else to avoid losing focus on Android Chrome -->
  <Play class={!particlesPaused ? 'hidden' : undefined} />
  <Pause class={particlesPaused ? 'hidden' : undefined} />
</section>

<style>
  section {
    padding: 0.25rem 0.75rem;
    pointer-events: auto;
    border-radius: 4px;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 0.25s ease 0s;
    cursor: pointer;

    margin-left: auto;
    margin-top: auto;
    display: flex;
    align-items: center;
  }

  section:focus, section:hover {
    background-color: var(--input-color);
    outline: none;
  }

  section:focus:not(:focus-visible):not(:hover) {
    background-color: inherit;
  }

  h3 {
    margin: 0;
    margin-right: 0.5em;
    font-size: 1em;
  }

  section :global(svg) {
    filter: drop-shadow(0 0 0.25em black);
  }

  section :global(.hidden) {
    display: none;
  }
</style>
