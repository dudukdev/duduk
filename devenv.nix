{ pkgs, lib, config, inputs, ... }:

{
  packages = [ pkgs.git ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
  };

  enterShell = ''
    git --version
    echo node version $(node --version)
  '';
}
