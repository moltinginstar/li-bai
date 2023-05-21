<template>
  <div class="flex flex-col h-screen p-6 sm:p-8">
    <header class="flex flex-row gap-4 items-start">
      <img class="w-12 mt-1" src="/favicon.png" />

      <div>
        <h1 class="text-2xl">
          Լի Պայ
        </h1>

        <p class="text-sm text-gray-800 mt-0.5">Ճշգրիտ չինարեն-հայերեն տառադարձություն</p>
      </div>
    </header>

    <main class="h-full">
      <form class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center h-3/5 sm:h-2/5 mt-16 sm:mt-24">
        <div class="flex flex-col flex-1 h-full">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="input-text">
            Փինյին
          </label>

          <textarea
            id="input-text"
            v-model="inputText"
            class="appearance-none block resize-none  w-full h-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            :placeholder="inputExample"
          />
        </div>

        <div class="flex flex-col flex-1 h-full">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="translated-text">
            Հայերեն
          </label>

          <textarea
            id="translated-text"
            :value="translatedText"
            class="appearance-none block resize-none w-full h-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            :placeholder="translatedExample"
            readonly
          />
        </div>
      </form>

      <p class="text-xs text-gray-600 mt-1">
        <a class="hover:text-gray-400" href="https://en.wikipedia.org/wiki/Erhua" target="_blank">Ըրխուան</a> ներկայումս հասանելի չէ։
      </p>
    </main>

    <footer>
      <a class="text-xs text-gray-400" href="https://www.flaticon.com/free-icons/chinese" title="chinese icons">Chinese icons created by Freepik - Flaticon</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { capitalize, computed, ref, watch } from 'vue';
import { buildPinyinPrefixTree, pinyinToArmenian } from '@/consts/table';
import { examples } from '@/consts/examples';
import { isLowerCase, stripAccents } from '@/util/string';
import { choose } from '@/util/random';

const inputText = ref('');
const translatedText = computed(() => translate(inputText.value));

const inputExample = ref('');
const translatedExample = ref('');

const foriest = buildPinyinPrefixTree();

// TODO: Handle erhua
const parse = (pinyin: string) => {
  pinyin = stripAccents(pinyin).toLowerCase().trim();
  pinyin = pinyin.replace(/’/g, "'");
  pinyin = pinyin.replace(/'(?!a|e|o)/g, ""); // Also r, as in e'r
  pinyin = pinyin.replace(/ng(?=a|e|o|u)/g, "n'g");
  pinyin = pinyin.replace(/n(?=a|e|o|u|i|ü)/g, "'n");

  const syls: string[] = [];

  let trie = foriest;
  let syl: string[] = [];
  for (const c of pinyin + "'") {
    if (c === "'" || !(c in trie)) {
      if (syl) {
        syls.push(syl.join(""));
        trie = foriest;
        syl = [];
      }

      if (c === "'") continue;
    }

    trie = trie[c];
    if (!trie) return [];

    syl.push(c);
  }

  return syls;
};

const translate = (text: string) => {
	const res: string[] = [];
	for (const word of text.split(" ")) {
		const translatedWord: string[] = [];
		for (const part of word.split("-")) {
			const parsed = parse(part);

			let translated: string[] = [];
      for (let i = 0; i < parsed.length; i++) {
				let syl_ = pinyinToArmenian[parsed[i]];
				if (!syl_) continue;

				syl_ = syl_.replace("e", i == 0 ? "է" : "ե")
				syl_ = syl_.replace("o", i == 0 ? "օ" : "ո")
				syl_ = syl_.replace("y", i == 0 ?  "" : "յ")
				translated.push(syl_);
      }
			const translatedPart = translated.join("");

			translatedWord.push(!isLowerCase(part) ? capitalize(translatedPart) : translatedPart)
    }

		res.push(translatedWord.join("-"))
  }

	return res.join(" ");
};

watch(inputText, (text) => {
  if (text) {
    inputExample.value = '';
    translatedExample.value = '';

    return
  };

  inputExample.value = choose(examples);
  translatedExample.value = translate(inputExample.value);
}, { immediate: true });
</script>
