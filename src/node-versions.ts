interface NodeVersionDescriptor {
	/** If set this version is EOL since given date */
	eol?: string;
}

/* https://github.com/nodejs/Release/blob/main/schedule.json */
export const nodeVersions: Array<[string, NodeVersionDescriptor]> = [
	["0.10.x", { eol: "2016-10-31" }],
	["0.12.x", { eol: "2016-12-31" }],
	["4.x.x", { eol: "2018-04-30" }],
	["5.x.x", { eol: "2016-06-30" }],
	["6.x.x", { eol: "2019-04-30" }],
	["7.x.x", { eol: "2017-06-30" }],
	["8.x.x", { eol: "2019-12-31" }],
	["9.x.x", { eol: "2018-06-30" }],
	["10.x.x", { eol: "2021-04-30" }],
	["11.x.x", { eol: "2019-06-01" }],
	["12.x.x", { eol: "2022-04-30" }],
	["13.x.x", { eol: "2020-06-01" }],
	["14.x.x", { eol: "2023-04-30" }],
	["15.x.x", { eol: "2021-06-01" }],
	["16.x.x", { eol: "2023-09-11" }],
	["17.x.x", { eol: "2022-06-01" }],
	["18.x.x", { eol: "2025-04-30" }],
	["19.x.x", { eol: "2023-06-01" }],
	["20.x.x", {}],
	["21.x.x", { eol: "2024-06-01" }],
	["22.x.x", {}],
];
