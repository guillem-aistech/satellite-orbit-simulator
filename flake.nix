{
  description = "Satellite Visualization";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js 24
            nodejs_24

            # Package manager
            pnpm

            # TypeScript tooling
            nodePackages.typescript
            nodePackages.typescript-language-server

            # Useful dev tools
            git
            gh
          ];

          shellHook = ''
            echo "🛰️  Satellite Visualization Development Environment"
            echo ""
            echo "Node.js: $(node --version)"
            echo "pnpm:    $(pnpm --version)"
            echo "TypeScript: $(tsc --version)"
            echo ""
            echo "Commands:"
            echo "  pnpm install    - Install dependencies"
            echo "  pnpm dev        - Start development server"
            echo "  pnpm build      - Build for production"
            echo ""
          '';
        };
      }
    );
}
