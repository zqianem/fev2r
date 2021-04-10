<script>
  import Button from './Button.svelte';
  import SkipBack32 from "carbon-icons-svelte/lib/SkipBack32";
  import ChevronLeft32 from "carbon-icons-svelte/lib/ChevronLeft32";
  import ChevronRight32 from "carbon-icons-svelte/lib/ChevronRight32";
  import SkipForward32 from "carbon-icons-svelte/lib/SkipForward32";

  export let dataset;
  export let date;

  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  };

  function stepDate(hours) {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours() + hours,
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
  }

  const bigStep = 6;
  const msInHour = 60 * 60 * 1000;
</script>

<div>
  <Button
    action={() => stepDate(-bigStep * dataset.intervalInHours)}
    disabled={date.getTime() - bigStep * msInHour < dataset.start}
    tip={`-${bigStep * dataset.intervalInHours} hours`}
    flex
  >
    <SkipBack32 />
  </Button>
  <Button
    action={() => stepDate(-dataset.intervalInHours)}
    disabled={date <= dataset.start}
    tip={`-${dataset.intervalInHours} hours`}
    flex secondary
  >
    <ChevronLeft32 />
  </Button>
  <span>
    {date.toLocaleTimeString(undefined, timeOptions)}
  </span>
  <Button
    action={() => stepDate(dataset.intervalInHours)}
    disabled={date >= dataset.end}
    tip={`+${dataset.intervalInHours} hours`}
    flex secondary
  >
    <ChevronRight32 />
  </Button>
  <Button
    action={() => stepDate(bigStep * dataset.intervalInHours)}
    disabled={date.getTime() + bigStep * msInHour > dataset.end}
    tip={`+${bigStep * dataset.intervalInHours} hours`}
    flex
  >
    <SkipForward32 />
  </Button>
</div>

<style>
  div {
    display: flex;
  }

  div > :global(*) {
    margin-left: 2px;
  }

  span {
    width: 8em;
    font-size: 1.2em;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>