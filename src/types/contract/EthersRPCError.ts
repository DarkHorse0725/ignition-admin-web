/**
 * EXAMPLE:
 {
	"code": -32603,
	"data": {
		"code": -32000,
		"data": {
			"hash": null,
			"message": "revert",
			"programCounter": 889,
			"reason": null,
			"result": "0x"
		},
		"message": "VM Exception while processing transaction: revert",
		"name": "RuntimeError",
		"stack": "RuntimeError: VM Exception while processing transaction: revert\n    at exactimate (/Users/XXX/.nvm/versions/node/v14.19.0/lib/node_modules/ganache/dist/node/1.js:2:113020)"
	},
	"message": "Internal JSON-RPC error."
 }
 */
export interface EthersRPCError {
  code: number;
  data: {
    code: number;
    data: {
      hash?: string | null;
      message: string;
      programCounter: number;
      reason?: string | null;
      result: string;
    };
    message: string;
    name: string;
    stack: string;
  };
  message: string;
}
